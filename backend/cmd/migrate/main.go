package main

import (
	"fmt"
	"log"

	"devswipe-backend/internal/config"
	"devswipe-backend/pkg/database"
)

func main() {
	// 加载配置
	config.LoadConfig()

	// 初始化数据库
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// 执行数据库迁移
	if err := migrateDatabase(); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	fmt.Println("Database migration completed successfully!")
}

func migrateDatabase() error {
	db := database.DB

	// 更新users表的tech_stack字段
	if err := db.Exec("ALTER TABLE users MODIFY COLUMN tech_stack TEXT").Error; err != nil {
		return fmt.Errorf("failed to update users.tech_stack: %w", err)
	}
	fmt.Println("✅ Updated users.tech_stack to TEXT")

	// 更新projects表的image_urls字段
	if err := db.Exec("ALTER TABLE projects MODIFY COLUMN image_urls TEXT").Error; err != nil {
		return fmt.Errorf("failed to update projects.image_urls: %w", err)
	}
	fmt.Println("✅ Updated projects.image_urls to TEXT")

	// 更新user_preferences表的preferred_tags字段
	if err := db.Exec("ALTER TABLE user_preferences MODIFY COLUMN preferred_tags TEXT").Error; err != nil {
		return fmt.Errorf("failed to update user_preferences.preferred_tags: %w", err)
	}
	fmt.Println("✅ Updated user_preferences.preferred_tags to TEXT")

	return nil
}
