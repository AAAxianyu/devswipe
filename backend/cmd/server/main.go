package main

import (
	"log"
	"net/http"

	"devswipe-backend/internal/config"
	"devswipe-backend/internal/handlers"
	"devswipe-backend/internal/middleware"
	"devswipe-backend/pkg/auth"
	"devswipe-backend/pkg/cache"
	"devswipe-backend/pkg/database"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	config.LoadConfig()

	// 初始化JWT
	auth.InitJWT()

	// 初始化数据库
	if err := database.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer database.CloseDB()

	// 自动迁移数据库
	if err := database.AutoMigrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// 初始化Redis
	if err := cache.InitRedis(); err != nil {
		log.Fatal("Failed to initialize Redis:", err)
	}
	defer cache.CloseRedis()

	// 设置Gin模式
	if config.AppConfig.Server.Host == "localhost" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建路由
	router := gin.New()

	// 中间件
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware())

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "DevSwipe API is running",
		})
	})

	// 初始化处理器
	userHandler := handlers.NewUserHandler()
	projectHandler := handlers.NewProjectHandler()

	// API路由组
	api := router.Group("/api/v1")
	{
		// 认证路由
		auth := api.Group("/auth")
		{
			auth.POST("/register", userHandler.Register)
			auth.POST("/login", userHandler.Login)
		}

		// 用户路由
		users := api.Group("/users")
		{
			users.GET("/me", middleware.AuthMiddleware(), userHandler.GetProfile)
			users.PUT("/me", middleware.AuthMiddleware(), userHandler.UpdateProfile)
			users.GET("/:id/followers", userHandler.GetFollowers)
			users.GET("/:id/following", userHandler.GetFollowing)
			users.POST("/:id/follow", middleware.AuthMiddleware(), userHandler.FollowUser)
			users.DELETE("/:id/follow", middleware.AuthMiddleware(), userHandler.UnfollowUser)
			users.GET("/:id/projects", projectHandler.GetUserProjects)
		}

		// 项目路由
		projects := api.Group("/projects")
		{
			projects.GET("/feed", middleware.OptionalAuthMiddleware(), projectHandler.GetFeed)
			projects.GET("/search", projectHandler.SearchProjects)
			// 同时支持带斜杠和不带斜杠的创建接口，避免前端或工具差异导致404
			projects.POST("/", middleware.AuthMiddleware(), projectHandler.CreateProject)
			projects.POST("", middleware.AuthMiddleware(), projectHandler.CreateProject)
			projects.GET("/:id", projectHandler.GetProject)
			projects.PUT("/:id", middleware.AuthMiddleware(), projectHandler.UpdateProject)
			projects.DELETE("/:id", middleware.AuthMiddleware(), projectHandler.DeleteProject)
			projects.GET("/:id/stats", projectHandler.GetProjectStats)
			projects.POST("/:id/interact", middleware.AuthMiddleware(), projectHandler.InteractWithProject)
			projects.POST("/:id/comments", middleware.AuthMiddleware(), projectHandler.AddComment)
			projects.GET("/:id/comments", projectHandler.GetComments)
		}
	}

	// 启动服务器
	serverAddr := config.AppConfig.Server.Host + ":" + config.AppConfig.Server.Port
	log.Printf("Server starting on %s", serverAddr)

	if err := router.Run(serverAddr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
