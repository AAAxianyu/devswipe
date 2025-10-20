package services

import (
	"devswipe-backend/internal/models"
	"devswipe-backend/internal/repositories"
	"devswipe-backend/pkg/auth"
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo *repositories.UserRepository
}

func NewUserService() *UserService {
	return &UserService{
		userRepo: repositories.NewUserRepository(),
	}
}

type RegisterRequest struct {
	Username  string   `json:"username" binding:"required,min=3,max=50"`
	Email     string   `json:"email" binding:"required,email"`
	Password  string   `json:"password" binding:"required,min=6"`
	TechStack []string `json:"tech_stack"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	UserID   int64  `json:"user_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Token    string `json:"token"`
}

func (s *UserService) Register(req *RegisterRequest) (*AuthResponse, error) {
	// 检查邮箱是否已存在
	existingUser, err := s.userRepo.GetByEmail(req.Email)
	if err == nil && existingUser != nil {
		return nil, errors.New("email already exists")
	}

	// 检查用户名是否已存在
	existingUser, err = s.userRepo.GetByUsername(req.Username)
	if err == nil && existingUser != nil {
		return nil, errors.New("username already exists")
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 创建用户
	user := &models.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		TechStack:    strings.Join(req.TechStack, ","),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	// 生成JWT token
	token, err := auth.GenerateToken(user.ID, user.Username, user.Email)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		UserID:   user.ID,
		Username: user.Username,
		Email:    user.Email,
		Token:    token,
	}, nil
}

func (s *UserService) Login(req *LoginRequest) (*AuthResponse, error) {
	// 获取用户
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}
	// 用户不存在时返回统一的认证错误，避免空指针
	if user == nil {
		return nil, errors.New("invalid email or password")
	}

	// 验证密码
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// 生成JWT token
	token, err := auth.GenerateToken(user.ID, user.Username, user.Email)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		UserID:   user.ID,
		Username: user.Username,
		Email:    user.Email,
		Token:    token,
	}, nil
}

func (s *UserService) GetUserProfile(userID int64) (*models.User, error) {
	return s.userRepo.GetByID(userID)
}

func (s *UserService) UpdateUserProfile(userID int64, updates map[string]interface{}) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}

	// 更新允许的字段
	if bio, ok := updates["bio"].(string); ok {
		user.Bio = bio
	}
	if avatarURL, ok := updates["avatar_url"].(string); ok {
		user.AvatarURL = avatarURL
	}
	if techStack, ok := updates["tech_stack"].([]string); ok {
		user.TechStack = strings.Join(techStack, ",")
	}

	return s.userRepo.Update(user)
}

func (s *UserService) FollowUser(followerID, followingID int64) error {
	if followerID == followingID {
		return errors.New("cannot follow yourself")
	}
	return s.userRepo.FollowUser(followerID, followingID)
}

func (s *UserService) UnfollowUser(followerID, followingID int64) error {
	return s.userRepo.UnfollowUser(followerID, followingID)
}

func (s *UserService) GetFollowers(userID int64, limit, offset int) ([]models.User, error) {
	return s.userRepo.GetFollowers(userID, limit, offset)
}

func (s *UserService) GetFollowing(userID int64, limit, offset int) ([]models.User, error) {
	return s.userRepo.GetFollowing(userID, limit, offset)
}
