package models

import (
	"time"
)

type Project struct {
	ID             int64     `json:"id" gorm:"primaryKey"`
	UserID         int64     `json:"user_id" gorm:"not null"`
	Title          string    `json:"title" gorm:"size:100;not null"`
	Description    string    `json:"description" gorm:"type:text"`
	CoverImage     string    `json:"cover_image" gorm:"size:500"`
	ImageURLs      string    `json:"image_urls" gorm:"type:text"`
	ProjectURL     string    `json:"project_url" gorm:"size:500"`
	Status         string    `json:"status" gorm:"size:20;default:'demo'"`
	ViewCount      int       `json:"view_count" gorm:"default:0"`
	LikeCount      int       `json:"like_count" gorm:"default:0"`
	DislikeCount   int       `json:"dislike_count" gorm:"default:0"`
	SuperLikeCount int       `json:"super_like_count" gorm:"default:0"`
	SkipCount      int       `json:"skip_count" gorm:"default:0"`
	CommentCount   int       `json:"comment_count" gorm:"default:0"`
	CompletionRate float64   `json:"completion_rate" gorm:"default:0"`
	IsPublic       bool      `json:"is_public" gorm:"default:true"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`

	// 关联字段
	User            User              `json:"user" gorm:"foreignKey:UserID"`
	Tags            []ProjectTag      `json:"tags" gorm:"foreignKey:ProjectID"`
	Interactions    []UserInteraction `json:"interactions,omitempty" gorm:"foreignKey:ProjectID"`
	Comments        []Comment         `json:"comments,omitempty" gorm:"foreignKey:ProjectID"`
	CollectionItems []CollectionItem  `json:"collection_items,omitempty" gorm:"foreignKey:ProjectID"`
}

type ProjectTag struct {
	ID        int64     `json:"id" gorm:"primaryKey"`
	ProjectID int64     `json:"project_id" gorm:"not null"`
	TagName   string    `json:"tag_name" gorm:"size:50;not null"`
	TagType   string    `json:"tag_type" gorm:"size:20;not null"` // tech, domain, function, stage, hackathon
	CreatedAt time.Time `json:"created_at"`

	Project Project `json:"project" gorm:"foreignKey:ProjectID"`

	// 确保一个项目不能有重复的标签
	// UniqueConstraint struct{} `gorm:"uniqueIndex:idx_project_tag,unique"`
}

type ProjectStats struct {
	ProjectID      int64   `json:"project_id"`
	LikeRate       float64 `json:"like_rate"`
	ViewRate       float64 `json:"view_rate"`
	EngagementRate float64 `json:"engagement_rate"`
	TotalViews     int     `json:"total_views"`
	TotalLikes     int     `json:"total_likes"`
	TotalDislikes  int     `json:"total_dislikes"`
	TotalComments  int     `json:"total_comments"`
}

// TableName 指定表名
func (ProjectTag) TableName() string {
	return "project_tags"
}
