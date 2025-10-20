package models

import (
	"time"
)

type UserInteraction struct {
	ID                 int64     `json:"id" gorm:"primaryKey"`
	UserID             int64     `json:"user_id" gorm:"not null"`
	ProjectID          int64     `json:"project_id" gorm:"not null"`
	InteractionType    string    `json:"interaction_type" gorm:"size:20;not null"` // like, dislike, super_like, skip, bookmark
	StructuredFeedback string    `json:"structured_feedback" gorm:"size:50"`       // not_interested, unclear_problem, easy_tech, existing_products, poor_demo
	SessionID          string    `json:"session_id" gorm:"size:100"`
	ViewDuration       float64   `json:"view_duration"` // 观看时长（秒）
	CreatedAt          time.Time `json:"created_at"`

	User    User    `json:"user" gorm:"foreignKey:UserID"`
	Project Project `json:"project" gorm:"foreignKey:ProjectID"`

	// 确保一个用户对一个项目只能有一种交互类型
	// UniqueConstraint struct{} `gorm:"uniqueIndex:idx_user_project_interaction,unique"`
}

type Comment struct {
	ID          int64     `json:"id" gorm:"primaryKey"`
	UserID      int64     `json:"user_id" gorm:"not null"`
	ProjectID   int64     `json:"project_id" gorm:"not null"`
	ParentID    *int64    `json:"parent_id"` // 支持回复
	Content     string    `json:"content" gorm:"type:text;not null"`
	IsTechnical bool      `json:"is_technical" gorm:"default:false"` // 是否包含技术内容
	LikeCount   int       `json:"like_count" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	User    User      `json:"user" gorm:"foreignKey:UserID"`
	Project Project   `json:"project" gorm:"foreignKey:ProjectID"`
	Parent  *Comment  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Replies []Comment `json:"replies,omitempty" gorm:"foreignKey:ParentID"`
}

type Collection struct {
	ID          int64     `json:"id" gorm:"primaryKey"`
	UserID      int64     `json:"user_id" gorm:"not null"`
	Name        string    `json:"name" gorm:"size:100;not null"`
	Description string    `json:"description" gorm:"type:text"`
	IsPublic    bool      `json:"is_public" gorm:"default:false"`
	ItemCount   int       `json:"item_count" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	User  User             `json:"user" gorm:"foreignKey:UserID"`
	Items []CollectionItem `json:"items,omitempty" gorm:"foreignKey:CollectionID"`
}

type CollectionItem struct {
	ID           int64     `json:"id" gorm:"primaryKey"`
	CollectionID int64     `json:"collection_id" gorm:"not null"`
	ProjectID    int64     `json:"project_id" gorm:"not null"`
	Notes        string    `json:"notes" gorm:"type:text"`
	CreatedAt    time.Time `json:"created_at"`

	Collection Collection `json:"collection" gorm:"foreignKey:CollectionID"`
	Project    Project    `json:"project" gorm:"foreignKey:ProjectID"`

	// 确保一个项目在一个收藏夹中只能出现一次
	// UniqueConstraint struct{} `gorm:"uniqueIndex:idx_collection_project,unique"`
}
