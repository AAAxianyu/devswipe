package handlers

import (
	"net/http"
	"strconv"

	"devswipe-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	projectService     *services.ProjectService
	interactionService *services.InteractionService
}

func NewProjectHandler() *ProjectHandler {
	return &ProjectHandler{
		projectService:     services.NewProjectService(),
		interactionService: services.NewInteractionService(),
	}
}

// CreateProject 创建项目
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	var req services.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	project, err := h.projectService.CreateProject(userID.(int64), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, project)
}

// GetProject 获取项目详情
func (h *ProjectHandler) GetProject(c *gin.Context) {
	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	project, err := h.projectService.GetProjectByID(projectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Project not found",
		})
		return
	}

	// 增加浏览次数
	h.projectService.IncrementViewCount(projectID)

	c.JSON(http.StatusOK, project)
}

// UpdateProject 更新项目
func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	var req services.UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data",
		})
		return
	}

	project, err := h.projectService.UpdateProject(userID.(int64), projectID, &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, project)
}

// DeleteProject 删除项目
func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	err = h.projectService.DeleteProject(userID.(int64), projectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project deleted successfully",
	})
}

// GetUserProjects 获取用户项目
func (h *ProjectHandler) GetUserProjects(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user ID",
		})
		return
	}

	limitStr := c.DefaultQuery("limit", "20")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 20
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	projects, err := h.projectService.GetUserProjects(userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get user projects",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
	})
}

// GetFeed 获取项目浏览流
func (h *ProjectHandler) GetFeed(c *gin.Context) {
	userID, _ := c.Get("user_id") // 可选认证

	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "6")

	page, err := strconv.Atoi(pageStr)
	if err != nil {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 6
	}

	params := services.FeedParams{
		Page:      page,
		Limit:     limit,
		SessionID: c.Query("session_id"),
	}

	var userIDInt int64
	if userID != nil {
		userIDInt = userID.(int64)
	}

	projects, err := h.projectService.GetUserFeed(userIDInt, params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get feed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"projects":   projects,
		"has_more":   len(projects) == limit,
		"page":       page,
		"session_id": params.SessionID,
	})
}

// InteractWithProject 项目交互
func (h *ProjectHandler) InteractWithProject(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	var req services.InteractionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data",
		})
		return
	}

	req.ProjectID = projectID

	err = h.interactionService.ProcessInteraction(userID.(int64), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Interaction recorded successfully",
	})
}

// AddComment 添加评论
func (h *ProjectHandler) AddComment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	var req services.CommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data",
		})
		return
	}

	req.ProjectID = projectID

	comment, err := h.interactionService.AddComment(userID.(int64), &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

// GetComments 获取项目评论
func (h *ProjectHandler) GetComments(c *gin.Context) {
	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	limitStr := c.DefaultQuery("limit", "20")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 20
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	comments, err := h.interactionService.GetProjectComments(projectID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get comments",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"comments": comments,
	})
}

// GetProjectStats 获取项目统计
func (h *ProjectHandler) GetProjectStats(c *gin.Context) {
	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid project ID",
		})
		return
	}

	stats, err := h.projectService.GetProjectStats(projectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Project not found",
		})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// SearchProjects 搜索项目
func (h *ProjectHandler) SearchProjects(c *gin.Context) {
	keyword := c.Query("q")
	if keyword == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Search keyword is required",
		})
		return
	}

	limitStr := c.DefaultQuery("limit", "20")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 20
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	projects, err := h.projectService.SearchProjects(keyword, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to search projects",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"projects": projects,
		"keyword":  keyword,
	})
}
