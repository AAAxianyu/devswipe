package repositories

import (
	"devswipe-backend/internal/models"
	"devswipe-backend/pkg/database"
)

type InteractionRepository struct{}

func NewInteractionRepository() *InteractionRepository {
	return &InteractionRepository{}
}

func (r *InteractionRepository) Create(interaction *models.UserInteraction) error {
	return database.DB.Create(interaction).Error
}

func (r *InteractionRepository) GetByUserAndProject(userID, projectID int64) ([]models.UserInteraction, error) {
	var interactions []models.UserInteraction
	err := database.DB.Where("user_id = ? AND project_id = ?", userID, projectID).Find(&interactions).Error
	return interactions, err
}

func (r *InteractionRepository) GetByUser(userID int64, limit, offset int) ([]models.UserInteraction, error) {
	var interactions []models.UserInteraction
	err := database.DB.Preload("Project").Preload("Project.User").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&interactions).Error
	return interactions, err
}

func (r *InteractionRepository) GetByProject(projectID int64, limit, offset int) ([]models.UserInteraction, error) {
	var interactions []models.UserInteraction
	err := database.DB.Preload("User").
		Where("project_id = ?", projectID).
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&interactions).Error
	return interactions, err
}

func (r *InteractionRepository) GetInteractionStats(projectID int64) (map[string]int, error) {
	var stats []struct {
		InteractionType string
		Count           int
	}

	err := database.DB.Model(&models.UserInteraction{}).
		Select("interaction_type, COUNT(*) as count").
		Where("project_id = ?", projectID).
		Group("interaction_type").
		Scan(&stats).Error

	if err != nil {
		return nil, err
	}

	result := make(map[string]int)
	for _, stat := range stats {
		result[stat.InteractionType] = stat.Count
	}

	return result, nil
}
