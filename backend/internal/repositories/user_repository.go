package repositories

import (
	"devswipe-backend/internal/models"
	"devswipe-backend/pkg/database"
	"errors"

	"gorm.io/gorm"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (r *UserRepository) Create(user *models.User) error {
	return database.DB.Create(user).Error
}

func (r *UserRepository) GetByID(id int64) (*models.User, error) {
	var user models.User
	err := database.DB.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetByUsername(username string) (*models.User, error) {
	var user models.User
	err := database.DB.Where("username = ?", username).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *models.User) error {
	return database.DB.Save(user).Error
}

func (r *UserRepository) Delete(id int64) error {
	return database.DB.Delete(&models.User{}, id).Error
}

func (r *UserRepository) GetUserPreferences(userID int64) (*models.UserPreferences, error) {
	var preferences models.UserPreferences
	err := database.DB.Where("user_id = ?", userID).First(&preferences).Error
	if err != nil {
		// 如果没有找到偏好设置，返回默认值
		return &models.UserPreferences{
			UserID:        userID,
			PreferredTags: "[]",
		}, nil
	}
	return &preferences, nil
}

func (r *UserRepository) UpdateUserPreferences(preferences *models.UserPreferences) error {
	return database.DB.Save(preferences).Error
}

func (r *UserRepository) FollowUser(followerID, followingID int64) error {
	follow := &models.UserFollow{
		FollowerID:  followerID,
		FollowingID: followingID,
	}

	// 使用事务确保数据一致性
	return database.DB.Transaction(func(tx *gorm.DB) error {
		// 检查是否已经关注
		var existingFollow models.UserFollow
		err := tx.Where("follower_id = ? AND following_id = ?", followerID, followingID).First(&existingFollow).Error
		if err == nil {
			return errors.New("already following this user")
		}

		// 创建关注关系
		if err := tx.Create(follow).Error; err != nil {
			return err
		}

		// 更新关注者数量
		if err := tx.Model(&models.User{}).Where("id = ?", followingID).Update("follower_count", gorm.Expr("follower_count + 1")).Error; err != nil {
			return err
		}

		// 更新被关注者数量
		if err := tx.Model(&models.User{}).Where("id = ?", followerID).Update("following_count", gorm.Expr("following_count + 1")).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *UserRepository) UnfollowUser(followerID, followingID int64) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		// 删除关注关系
		result := tx.Where("follower_id = ? AND following_id = ?", followerID, followingID).Delete(&models.UserFollow{})
		if result.Error != nil {
			return result.Error
		}

		if result.RowsAffected == 0 {
			return errors.New("not following this user")
		}

		// 更新关注者数量
		if err := tx.Model(&models.User{}).Where("id = ?", followingID).Update("follower_count", gorm.Expr("follower_count - 1")).Error; err != nil {
			return err
		}

		// 更新被关注者数量
		if err := tx.Model(&models.User{}).Where("id = ?", followerID).Update("following_count", gorm.Expr("following_count - 1")).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *UserRepository) GetFollowers(userID int64, limit, offset int) ([]models.User, error) {
	var users []models.User
	err := database.DB.Table("users").
		Joins("JOIN user_follows ON users.id = user_follows.follower_id").
		Where("user_follows.following_id = ?", userID).
		Limit(limit).Offset(offset).
		Find(&users).Error
	return users, err
}

func (r *UserRepository) GetFollowing(userID int64, limit, offset int) ([]models.User, error) {
	var users []models.User
	err := database.DB.Table("users").
		Joins("JOIN user_follows ON users.id = user_follows.following_id").
		Where("user_follows.follower_id = ?", userID).
		Limit(limit).Offset(offset).
		Find(&users).Error
	return users, err
}
