package models

import (
	"time"
)

type User struct {
	ID             int64     `json:"id" gorm:"primaryKey"`
	Username       string    `json:"username" gorm:"size:50;uniqueIndex;not null"`
	Email          string    `json:"email" gorm:"size:100;uniqueIndex;not null"`
	PasswordHash   string    `json:"-" gorm:"size:255;not null"`
	AvatarURL      string    `json:"avatar_url" gorm:"size:500"`
	Bio            string    `json:"bio" gorm:"type:text"`
	TechStack      string    `json:"tech_stack" gorm:"type:text"`
	IsCreator      bool      `json:"is_creator" gorm:"default:false"`
	FollowerCount  int       `json:"follower_count" gorm:"default:0"`
	FollowingCount int       `json:"following_count" gorm:"default:0"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`

	// 关联字段 - 暂时注释掉以避免循环引用问题
	// Projects     []Project         `json:"projects,omitempty" gorm:"foreignKey:UserID"`
	// Interactions []UserInteraction `json:"interactions,omitempty" gorm:"foreignKey:UserID"`
	// Comments     []Comment         `json:"comments,omitempty" gorm:"foreignKey:UserID"`
	// Collections  []Collection      `json:"collections,omitempty" gorm:"foreignKey:UserID"`
}

type UserPreferences struct {
	ID            int64     `json:"id" gorm:"primaryKey"`
	UserID        int64     `json:"user_id" gorm:"not null"`
	PreferredTags string    `json:"preferred_tags" gorm:"type:text"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`

	User User `json:"user" gorm:"foreignKey:UserID"`
}

type UserFollow struct {
	ID          int64     `json:"id" gorm:"primaryKey"`
	FollowerID  int64     `json:"follower_id" gorm:"not null"`
	FollowingID int64     `json:"following_id" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`

	Follower  User `json:"follower" gorm:"foreignKey:FollowerID"`
	Following User `json:"following" gorm:"foreignKey:FollowingID"`

	// 确保一个用户不能重复关注另一个用户
	// UniqueConstraint struct{} `gorm:"uniqueIndex:idx_follower_following,unique"`
}

// TableName 指定表名
func (UserFollow) TableName() string {
	return "user_follows"
}
