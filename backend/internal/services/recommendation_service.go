package services

import (
	"context"
	"fmt"
	"math"
	"sort"
	"time"

	"devswipe-backend/internal/models"
	"devswipe-backend/internal/repositories"
	"devswipe-backend/pkg/cache"
	"devswipe-backend/pkg/database"
)

type RecommendationService struct {
	userRepo        *repositories.UserRepository
	projectRepo     *repositories.ProjectRepository
	interactionRepo *repositories.InteractionRepository
	cache           *cache.CacheManager
}

func NewRecommendationService() *RecommendationService {
	return &RecommendationService{
		userRepo:        repositories.NewUserRepository(),
		projectRepo:     repositories.NewProjectRepository(),
		interactionRepo: repositories.NewInteractionRepository(),
		cache:           cache.NewCacheManager(),
	}
}

type RecommendationScore struct {
	ProjectID int64   `json:"project_id"`
	Score     float64 `json:"score"`
	Reason    string  `json:"reason"`
}

// GetUserRecommendations 获取用户推荐项目
func (s *RecommendationService) GetUserRecommendations(userID int64, limit int) ([]int64, error) {
	ctx := context.Background()

	// 尝试从缓存获取
	cacheKey := fmt.Sprintf("user_recommendations:%d", userID)
	var cachedRecommendations []int64
	if err := s.cache.Get(ctx, cacheKey, &cachedRecommendations); err == nil {
		if len(cachedRecommendations) >= limit {
			return cachedRecommendations[:limit], nil
		}
	}

	// 获取用户偏好
	userPreferences, err := s.getUserPreferences(userID)
	if err != nil {
		return nil, err
	}

	// 获取用户交互历史
	userInteractions, err := s.interactionRepo.GetByUser(userID, 100, 0)
	if err != nil {
		return nil, err
	}

	// 获取候选项目
	candidateProjects, err := s.getCandidateProjects(userID, 200)
	if err != nil {
		return nil, err
	}

	// 计算推荐分数
	recommendations := s.calculateRecommendationScores(userID, candidateProjects, userPreferences, userInteractions)

	// 排序并返回前N个
	sort.Slice(recommendations, func(i, j int) bool {
		return recommendations[i].Score > recommendations[j].Score
	})

	var result []int64
	for i, rec := range recommendations {
		if i >= limit {
			break
		}
		result = append(result, rec.ProjectID)
	}

	// 缓存结果
	s.cache.Set(ctx, cacheKey, result, 30*time.Minute)

	return result, nil
}

// getUserPreferences 获取用户偏好
func (s *RecommendationService) getUserPreferences(userID int64) (map[string]float64, error) {
	preferences := make(map[string]float64)

	// 获取用户交互历史
	interactions, err := s.interactionRepo.GetByUser(userID, 1000, 0)
	if err != nil {
		return preferences, err
	}

	// 统计用户喜欢的项目标签
	tagScores := make(map[string]int)
	totalLikes := 0

	for _, interaction := range interactions {
		if interaction.InteractionType == "like" || interaction.InteractionType == "super_like" {
			totalLikes++

			// 获取项目标签
			var project models.Project
			if err := database.DB.Preload("Tags").First(&project, interaction.ProjectID).Error; err == nil {
				for _, tag := range project.Tags {
					tagScores[tag.TagName]++
				}
			}
		}
	}

	// 计算标签偏好分数
	if totalLikes > 0 {
		for tag, count := range tagScores {
			preferences[tag] = float64(count) / float64(totalLikes)
		}
	}

	return preferences, nil
}

// getCandidateProjects 获取候选项目
func (s *RecommendationService) getCandidateProjects(userID int64, limit int) ([]models.Project, error) {
	var projects []models.Project

	// 获取用户已交互的项目ID
	var interactedProjectIDs []int64
	rows, err := database.DB.Model(&models.UserInteraction{}).
		Where("user_id = ?", userID).
		Select("DISTINCT project_id").
		Rows()
	if err != nil {
		return projects, err
	}
	defer rows.Close()

	for rows.Next() {
		var projectID int64
		if err := rows.Scan(&projectID); err == nil {
			interactedProjectIDs = append(interactedProjectIDs, projectID)
		}
	}

	// 获取未交互的公开项目
	query := database.DB.Preload("User").Preload("Tags").
		Where("is_public = ?", true).
		Order("created_at DESC").
		Limit(limit)

	if len(interactedProjectIDs) > 0 {
		query = query.Where("id NOT IN ?", interactedProjectIDs)
	}

	err = query.Find(&projects).Error
	return projects, err
}

// calculateRecommendationScores 计算推荐分数
func (s *RecommendationService) calculateRecommendationScores(
	userID int64,
	projects []models.Project,
	userPreferences map[string]float64,
	userInteractions []models.UserInteraction,
) []RecommendationScore {
	var recommendations []RecommendationScore

	for _, project := range projects {
		score := 0.0
		reasons := []string{}

		// 1. 标签匹配分数 (40%)
		tagScore := s.calculateTagScore(project.Tags, userPreferences)
		score += tagScore * 0.4
		if tagScore > 0 {
			reasons = append(reasons, "标签匹配")
		}

		// 2. 热度分数 (30%)
		popularityScore := s.calculatePopularityScore(project)
		score += popularityScore * 0.3
		if popularityScore > 0.5 {
			reasons = append(reasons, "热门项目")
		}

		// 3. 新鲜度分数 (20%)
		freshnessScore := s.calculateFreshnessScore(project.CreatedAt)
		score += freshnessScore * 0.2
		if freshnessScore > 0.7 {
			reasons = append(reasons, "最新项目")
		}

		// 4. 用户相似度分数 (10%)
		similarityScore := s.calculateUserSimilarityScore(userID, project.UserID)
		score += similarityScore * 0.1
		if similarityScore > 0.5 {
			reasons = append(reasons, "相似用户推荐")
		}

		recommendations = append(recommendations, RecommendationScore{
			ProjectID: project.ID,
			Score:     score,
			Reason:    fmt.Sprintf("%.1f分 - %s", score, fmt.Sprintf("%v", reasons)),
		})
	}

	return recommendations
}

// calculateTagScore 计算标签匹配分数
func (s *RecommendationService) calculateTagScore(tags []models.ProjectTag, userPreferences map[string]float64) float64 {
	if len(tags) == 0 {
		return 0
	}

	totalScore := 0.0
	for _, tag := range tags {
		if score, exists := userPreferences[tag.TagName]; exists {
			totalScore += score
		}
	}

	return totalScore / float64(len(tags))
}

// calculatePopularityScore 计算热度分数
func (s *RecommendationService) calculatePopularityScore(project models.Project) float64 {
	totalInteractions := project.LikeCount + project.DislikeCount + project.SuperLikeCount + project.SkipCount
	if totalInteractions == 0 {
		return 0
	}

	// 计算喜爱率
	likeRate := float64(project.LikeCount+project.SuperLikeCount) / float64(totalInteractions)

	// 计算参与度
	engagementRate := float64(totalInteractions) / float64(project.ViewCount+1)

	// 综合分数
	return (likeRate * 0.7) + (engagementRate * 0.3)
}

// calculateFreshnessScore 计算新鲜度分数
func (s *RecommendationService) calculateFreshnessScore(createdAt time.Time) float64 {
	daysSinceCreated := time.Since(createdAt).Hours() / 24

	// 使用指数衰减函数
	return math.Exp(-daysSinceCreated / 30) // 30天半衰期
}

// calculateUserSimilarityScore 计算用户相似度分数
func (s *RecommendationService) calculateUserSimilarityScore(userID, projectUserID int64) float64 {
	// 简化实现：检查是否关注了项目作者
	var followCount int64
	database.DB.Model(&models.UserFollow{}).
		Where("follower_id = ? AND following_id = ?", userID, projectUserID).
		Count(&followCount)

	if followCount > 0 {
		return 1.0
	}

	// 检查共同关注
	var commonFollows int64
	database.DB.Raw(`
		SELECT COUNT(*) FROM user_follows uf1
		JOIN user_follows uf2 ON uf1.following_id = uf2.following_id
		WHERE uf1.follower_id = ? AND uf2.follower_id = ?
	`, userID, projectUserID).Scan(&commonFollows)

	if commonFollows > 0 {
		return 0.5
	}

	return 0
}
