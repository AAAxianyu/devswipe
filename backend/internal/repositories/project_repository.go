package repositories

import (
	"devswipe-backend/internal/models"
	"devswipe-backend/pkg/database"

	"gorm.io/gorm"
)

type ProjectRepository struct{}

func NewProjectRepository() *ProjectRepository {
	return &ProjectRepository{}
}

func (r *ProjectRepository) Create(project *models.Project) error {
	return database.DB.Create(project).Error
}

func (r *ProjectRepository) GetByID(id int64) (*models.Project, error) {
	var project models.Project
	err := database.DB.Preload("User").Preload("Tags").First(&project, id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepository) GetByUserID(userID int64, limit, offset int) ([]models.Project, error) {
	var projects []models.Project
	err := database.DB.Preload("Tags").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) Update(project *models.Project) error {
	return database.DB.Save(project).Error
}

func (r *ProjectRepository) Delete(id int64) error {
	return database.DB.Delete(&models.Project{}, id).Error
}

func (r *ProjectRepository) GetRecommendedProjects(userID int64, limit int) ([]models.Project, error) {
	var projects []models.Project

	// 基础推荐算法：获取最新的公开项目，排除用户已交互的项目
	query := database.DB.Preload("User").Preload("Tags").
		Where("is_public = ?", true).
		Order("created_at DESC").
		Limit(limit)

	// 排除用户已经交互过的项目
	if userID > 0 {
		query = query.Where("id NOT IN (SELECT project_id FROM user_interactions WHERE user_id = ?)", userID)
	}

	err := query.Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) GetProjectsByTags(tags []string, limit, offset int) ([]models.Project, error) {
	var projects []models.Project

	query := database.DB.Preload("User").Preload("Tags").
		Where("is_public = ?", true)

	if len(tags) > 0 {
		query = query.Joins("JOIN project_tags ON projects.id = project_tags.project_id").
			Where("project_tags.tag_name IN ?", tags).
			Group("projects.id")
	}

	err := query.Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) SearchProjects(keyword string, limit, offset int) ([]models.Project, error) {
	var projects []models.Project

	err := database.DB.Preload("User").Preload("Tags").
		Where("is_public = ? AND (title LIKE ? OR description LIKE ?)",
			true, "%"+keyword+"%", "%"+keyword+"%").
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) IncrementViewCount(projectID int64) error {
	return database.DB.Model(&models.Project{}).
		Where("id = ?", projectID).
		Update("view_count", gorm.Expr("view_count + 1")).Error
}

func (r *ProjectRepository) UpdateStats(projectID int64, field string, increment int) error {
	return database.DB.Model(&models.Project{}).
		Where("id = ?", projectID).
		Update(field, gorm.Expr(field+" + ?", increment)).Error
}

func (r *ProjectRepository) GetProjectStats(projectID int64) (*models.ProjectStats, error) {
	var project models.Project
	err := database.DB.Select("id, like_count, dislike_count, view_count, comment_count").
		First(&project, projectID).Error
	if err != nil {
		return nil, err
	}

	stats := &models.ProjectStats{
		ProjectID:     project.ID,
		TotalViews:    project.ViewCount,
		TotalLikes:    project.LikeCount,
		TotalDislikes: project.DislikeCount,
		TotalComments: project.CommentCount,
	}

	// 计算喜爱率
	totalInteractions := project.LikeCount + project.DislikeCount
	if totalInteractions > 0 {
		stats.LikeRate = float64(project.LikeCount) / float64(totalInteractions)
	}

	// 计算参与率（简化版）
	if project.ViewCount > 0 {
		stats.EngagementRate = float64(project.LikeCount+project.DislikeCount+project.CommentCount) / float64(project.ViewCount)
	}

	return stats, nil
}
