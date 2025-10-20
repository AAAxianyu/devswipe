package services

import (
	"context"
	"devswipe-backend/internal/models"
	"devswipe-backend/internal/repositories"
	"devswipe-backend/pkg/cache"
	"devswipe-backend/pkg/database"
	"errors"
	"fmt"
	"strings"
	"time"
)

type ProjectService struct {
	projectRepo *repositories.ProjectRepository
	cache       *cache.CacheManager
}

func NewProjectService() *ProjectService {
	return &ProjectService{
		projectRepo: repositories.NewProjectRepository(),
		cache:       cache.NewCacheManager(),
	}
}

type CreateProjectRequest struct {
	Title       string   `json:"title" binding:"required,max=100"`
	Description string   `json:"description"`
	CoverImage  string   `json:"cover_image"`
	ImageURLs   []string `json:"image_urls"`
	ProjectURL  string   `json:"project_url"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
}

type UpdateProjectRequest struct {
	Title       *string  `json:"title"`
	Description *string  `json:"description"`
	CoverImage  *string  `json:"cover_image"`
	ImageURLs   []string `json:"image_urls"`
	ProjectURL  *string  `json:"project_url"`
	Status      *string  `json:"status"`
	Tags        []string `json:"tags"`
	IsPublic    *bool    `json:"is_public"`
}

type FeedParams struct {
	Page      int      `json:"page"`
	Limit     int      `json:"limit"`
	Tags      []string `json:"tags"`
	SessionID string   `json:"session_id"`
}

func (s *ProjectService) CreateProject(userID int64, req *CreateProjectRequest) (*models.Project, error) {
	project := &models.Project{
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		CoverImage:  req.CoverImage,
		ImageURLs:   strings.Join(req.ImageURLs, ","),
		ProjectURL:  req.ProjectURL,
		Status:      req.Status,
		IsPublic:    true,
	}

	if project.Status == "" {
		project.Status = "demo"
	}

	// 使用事务创建项目和标签
	err := s.projectRepo.Create(project)
	if err != nil {
		return nil, err
	}

	// 创建标签
	if len(req.Tags) > 0 {
		for _, tagName := range req.Tags {
			tag := &models.ProjectTag{
				ProjectID: project.ID,
				TagName:   tagName,
				TagType:   "tech", // 默认技术标签
			}
			// 这里简化处理，实际项目中可能需要更复杂的标签类型判断
			if err := database.DB.Create(tag).Error; err != nil {
				// 记录错误但不影响项目创建
				fmt.Printf("Failed to create tag %s: %v\n", tagName, err)
			}
		}
	}

	return project, nil
}

func (s *ProjectService) GetProjectByID(id int64) (*models.Project, error) {
	return s.projectRepo.GetByID(id)
}

func (s *ProjectService) GetUserProjects(userID int64, limit, offset int) ([]models.Project, error) {
	return s.projectRepo.GetByUserID(userID, limit, offset)
}

func (s *ProjectService) UpdateProject(userID, projectID int64, req *UpdateProjectRequest) (*models.Project, error) {
	project, err := s.projectRepo.GetByID(projectID)
	if err != nil {
		return nil, err
	}

	// 检查权限
	if project.UserID != userID {
		return nil, errors.New("unauthorized to update this project")
	}

	// 更新字段
	if req.Title != nil {
		project.Title = *req.Title
	}
	if req.Description != nil {
		project.Description = *req.Description
	}
	if req.CoverImage != nil {
		project.CoverImage = *req.CoverImage
	}
	if req.ImageURLs != nil {
		project.ImageURLs = strings.Join(req.ImageURLs, ",")
	}
	if req.ProjectURL != nil {
		project.ProjectURL = *req.ProjectURL
	}
	if req.Status != nil {
		project.Status = *req.Status
	}
	if req.IsPublic != nil {
		project.IsPublic = *req.IsPublic
	}

	err = s.projectRepo.Update(project)
	if err != nil {
		return nil, err
	}

	// 更新标签
	if req.Tags != nil {
		// 删除旧标签
		if err := database.DB.Where("project_id = ?", projectID).Delete(&models.ProjectTag{}).Error; err != nil {
			return nil, err
		}

		// 创建新标签
		for _, tagName := range req.Tags {
			tag := &models.ProjectTag{
				ProjectID: project.ID,
				TagName:   tagName,
				TagType:   "tech",
			}
			if err := database.DB.Create(tag).Error; err != nil {
				return nil, err
			}
		}
	}

	return project, nil
}

func (s *ProjectService) DeleteProject(userID, projectID int64) error {
	project, err := s.projectRepo.GetByID(projectID)
	if err != nil {
		return err
	}

	// 检查权限
	if project.UserID != userID {
		return errors.New("unauthorized to delete this project")
	}

	return s.projectRepo.Delete(projectID)
}

func (s *ProjectService) GetUserFeed(userID int64, params FeedParams) ([]models.Project, error) {
	// 尝试从缓存获取
	cacheKey := fmt.Sprintf("user_feed:%d:%d", userID, params.Page)
	var cachedProjects []models.Project
	ctx := context.Background()

	if err := s.cache.Get(ctx, cacheKey, &cachedProjects); err == nil {
		return cachedProjects, nil
	}

	// 从数据库获取
	var projects []models.Project
	var err error

	if len(params.Tags) > 0 {
		// 按标签过滤
		projects, err = s.projectRepo.GetProjectsByTags(params.Tags, params.Limit, (params.Page-1)*params.Limit)
	} else if userID > 0 {
		// 使用推荐算法
		recommendationService := NewRecommendationService()
		recommendedIDs, recErr := recommendationService.GetUserRecommendations(userID, params.Limit)
		if recErr == nil && len(recommendedIDs) > 0 {
			// 根据推荐ID获取项目详情
			err = database.DB.Preload("User").Preload("Tags").
				Where("id IN ?", recommendedIDs).
				Find(&projects).Error
		} else {
			// 回退到基础推荐
			projects, err = s.projectRepo.GetRecommendedProjects(userID, params.Limit)
		}
	} else {
		// 未登录用户，获取最新项目
		projects, err = s.projectRepo.GetRecommendedProjects(0, params.Limit)
	}

	if err != nil {
		return nil, err
	}

	// 缓存结果
	s.cache.Set(ctx, cacheKey, projects, 10*time.Minute)

	return projects, nil
}

func (s *ProjectService) SearchProjects(keyword string, limit, offset int) ([]models.Project, error) {
	return s.projectRepo.SearchProjects(keyword, limit, offset)
}

func (s *ProjectService) IncrementViewCount(projectID int64) error {
	return s.projectRepo.IncrementViewCount(projectID)
}

func (s *ProjectService) GetProjectStats(projectID int64) (*models.ProjectStats, error) {
	// 尝试从缓存获取
	cacheKey := fmt.Sprintf("project_stats:%d", projectID)
	var cachedStats models.ProjectStats
	ctx := context.Background()

	if err := s.cache.Get(ctx, cacheKey, &cachedStats); err == nil {
		return &cachedStats, nil
	}

	// 从数据库获取
	stats, err := s.projectRepo.GetProjectStats(projectID)
	if err != nil {
		return nil, err
	}

	// 缓存结果
	s.cache.Set(ctx, cacheKey, stats, 30*time.Minute)

	return stats, nil
}
