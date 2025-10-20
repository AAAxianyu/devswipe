package services

import (
	"devswipe-backend/internal/models"
	"devswipe-backend/internal/repositories"
	"devswipe-backend/pkg/database"
	"errors"

	"gorm.io/gorm"
)

type InteractionService struct {
	interactionRepo *repositories.InteractionRepository
	projectRepo     *repositories.ProjectRepository
}

func NewInteractionService() *InteractionService {
	return &InteractionService{
		interactionRepo: repositories.NewInteractionRepository(),
		projectRepo:     repositories.NewProjectRepository(),
	}
}

type InteractionRequest struct {
	ProjectID          int64   `json:"project_id" binding:"required"`
	Type               string  `json:"type" binding:"required,oneof=like dislike super_like skip bookmark"`
	StructuredFeedback string  `json:"structured_feedback,omitempty"`
	ViewDuration       float64 `json:"view_duration"`
	SessionID          string  `json:"session_id"`
}

type CommentRequest struct {
	ProjectID int64  `json:"project_id" binding:"required"`
	Content   string `json:"content" binding:"required"`
	ParentID  *int64 `json:"parent_id,omitempty"`
}

func (s *InteractionService) ProcessInteraction(userID int64, req *InteractionRequest) error {
	// 检查项目是否存在
	_, err := s.projectRepo.GetByID(req.ProjectID)
	if err != nil {
		return errors.New("project not found")
	}

	// 检查是否已经交互过
	var existingInteraction models.UserInteraction
	err = database.DB.Where("user_id = ? AND project_id = ? AND interaction_type = ?",
		userID, req.ProjectID, req.Type).First(&existingInteraction).Error
	if err == nil {
		return errors.New("already interacted with this project")
	}

	// 使用事务处理交互
	return database.DB.Transaction(func(tx *gorm.DB) error {
		// 创建交互记录
		interaction := &models.UserInteraction{
			UserID:             userID,
			ProjectID:          req.ProjectID,
			InteractionType:    req.Type,
			StructuredFeedback: req.StructuredFeedback,
			ViewDuration:       req.ViewDuration,
			SessionID:          req.SessionID,
		}

		if err := tx.Create(interaction).Error; err != nil {
			return err
		}

		// 更新项目统计
		var updateField string
		switch req.Type {
		case "like":
			updateField = "like_count = like_count + 1"
		case "dislike":
			updateField = "dislike_count = dislike_count + 1"
		case "super_like":
			updateField = "super_like_count = super_like_count + 1"
		case "skip":
			updateField = "skip_count = skip_count + 1"
		}

		if updateField != "" {
			if err := tx.Model(&models.Project{}).
				Where("id = ?", req.ProjectID).
				Update(updateField, gorm.Expr(updateField)).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *InteractionService) AddComment(userID int64, req *CommentRequest) (*models.Comment, error) {
	// 检查项目是否存在
	_, err := s.projectRepo.GetByID(req.ProjectID)
	if err != nil {
		return nil, errors.New("project not found")
	}

	// 检查是否是回复评论
	if req.ParentID != nil {
		var parentComment models.Comment
		err = database.DB.First(&parentComment, *req.ParentID).Error
		if err != nil {
			return nil, errors.New("parent comment not found")
		}
	}

	// 使用事务创建评论
	var comment models.Comment
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		comment = models.Comment{
			UserID:      userID,
			ProjectID:   req.ProjectID,
			ParentID:    req.ParentID,
			Content:     req.Content,
			IsTechnical: false, // 简化处理，实际项目中可能需要NLP分析
		}

		if err := tx.Create(&comment).Error; err != nil {
			return err
		}

		// 更新项目评论数
		if err := tx.Model(&models.Project{}).
			Where("id = ?", req.ProjectID).
			Update("comment_count", gorm.Expr("comment_count + 1")).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// 预加载用户信息
	database.DB.Preload("User").First(&comment, comment.ID)

	return &comment, nil
}

func (s *InteractionService) GetProjectComments(projectID int64, limit, offset int) ([]models.Comment, error) {
	var comments []models.Comment
	err := database.DB.Preload("User").Preload("Replies.User").
		Where("project_id = ? AND parent_id IS NULL", projectID).
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&comments).Error
	return comments, err
}

func (s *InteractionService) GetUserInteractions(userID int64, interactionType string, limit, offset int) ([]models.UserInteraction, error) {
	var interactions []models.UserInteraction
	query := database.DB.Preload("Project.User").Preload("Project.Tags").
		Where("user_id = ?", userID)

	if interactionType != "" {
		query = query.Where("interaction_type = ?", interactionType)
	}

	err := query.Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&interactions).Error
	return interactions, err
}
