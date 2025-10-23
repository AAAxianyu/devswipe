# DevSwipe 代码生成规范

## 项目概述
项目一期: 黑客松群体idea交流批判
项目二期: 扩大经营范围, 涵盖黑客松组队, AI技术交流(如:使用AI快速落地黑客松demo)等
项目三期: 形成与黑客松活动创办, 报名, 组队, 交流与一体的综合性开发者社区

DevSwipe 是一个基于 Tinder 滑动模式的开发者项目发现平台，采用 React/TypeScript 前端 + Go 后端的全栈架构。

# 前端开发规范

## 技术栈

- **框架**: React 18.2.0 + TypeScript 4.9.5
- **路由**: React Router DOM 6.16.0
- **状态管理**: Redux Toolkit (@reduxjs/toolkit 1.9.7)
- **HTTP客户端**: Axios 1.5.0
- **数据获取**: React Query 3.39.3
- **动画**: Motion 12.23.24
- **样式**: Tailwind CSS 3.3.5

## 设计规范

### 主题风格
- **主题色**: 蓝黑色调，充满极客风格
- **视觉元素**: 使用液态玻璃效果 (glassmorphism)
- **色彩方案**:
  - Primary: Blue 系列色 (50-900)
  - Secondary: Gray 系列中性色
  - Geek: Cyan/blue 蓝调作为科技品牌色
- **字体**: Inter 字体系统
- **动画**: 自定义关键帧动画 (fade-in, slide-up, bounce, liquid flow, glass shimmer, float)

### 样式编写规范

#### 1. 使用 Tailwind CSS
```bash
# ✅ 正确 - 使用 Tailwind 类名
<div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
  Submit
</div>

# ❌ 错误 - 使用原生 CSS
<div style="backgroundColor: '#3B82F6', color: 'white', padding: '16px'}>
  Submit
</div>
```

#### 2. 响应式设计
```tsx
// 移动优先的响应式设计
<div className="w-full md:w-96 lg:w-[500px]">
  Content
</div>
```

#### 3. 玻璃效果组件
```tsx
// 液态玻璃效果的标准实现
<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-lg">
  <div className="p-6">
    Content
  </div>
</div>
```

## 组件开发规范

### 1. 函数式组件 + TypeScript
```tsx
interface ProjectCardProps {
  project: Project;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLike, onPass }) => {
  return (
    <div className="glass-card">
      {/* 组件内容 */}
    </div>
  );
};

export default ProjectCard;
```

### 2. 自定义 Hooks
```tsx
// hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogin = (userData: LoginData) => {
    dispatch(loginSuccess(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
```

### 3. API 服务层
```tsx
// services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const projectApi = {
  getProjects: () => axios.get(`${API_BASE_URL}/projects`),
  getProject: (id: string) => axios.get(`${API_BASE_URL}/projects/${id}`),
  createProject: (data: CreateProjectData) => axios.post(`${API_BASE_URL}/projects`, data),
  updateProject: (id: string, data: UpdateProjectData) => axios.put(`${API_BASE_URL}/projects/${id}`, data),
  deleteProject: (id: string) => axios.delete(`${API_BASE_URL}/projects/${id}`),
};
```

## 文件结构规范

```
frontend/src/
├── components/           # 可复用组件
│   ├── project/         # 项目相关组件
│   │   ├── ProjectCard.tsx
│   │   └── ProjectUpload.tsx
│   ├── common/          # 通用布局组件
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
├── pages/              # 页面组件
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Feed.tsx
│   ├── ProjectUpload.tsx
│   ├── Search.tsx
│   ├── Profile.tsx
│   ├── MyProjects.tsx
│   └── Settings.tsx
├── hooks/              # 自定义 React hooks
│   ├── useAuth.ts
│   └── useFeed.ts
├── services/           # API 服务层
│   └── api.ts
├── store/              # Redux store 配置
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       └── projectSlice.ts
├── types/              # TypeScript 类型定义
│   └── index.ts
└── App.tsx             # 主应用组件
```

---

# 后端开发规范

## 技术栈

- **语言**: Go 1.24.0
- **Web框架**: Gin v1.11.0
- **数据库**: MySQL 8.0
- **ORM**: GORM v1.31.0
- **缓存**: Redis v9.14.1
- **认证**: JWT (golang-jwt/jwt v5.3.0)
- **配置管理**: Viper
- **CORS**: gin-contrib/cors

## 架构模式

采用分层架构：`Handler → Service → Repository → Model`

### 1. 模型定义 (Models)
```go
// models/user.go
package models

import (
    "time"
    "gorm.io/gorm"
)

type User struct {
    ID        uint           `json:"id" gorm:"primaryKey"`
    Username  string         `json:"username" gorm:"uniqueIndex;not null"`
    Email     string         `json:"email" gorm:"uniqueIndex;not null"`
    Password  string         `json:"-" gorm:"not null"`
    TechStack JSON           `json:"tech_stack" gorm:"type:json"`
    Bio       string         `json:"bio"`
    AvatarURL string         `json:"avatar_url"`
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
    DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
```

### 2. 仓储层 (Repository)
```go
// repositories/user_repository.go
package repositories

import (
    "devSwipe/internal/models"
    "gorm.io/gorm"
)

type UserRepository interface {
    Create(user *models.User) error
    GetByID(id uint) (*models.User, error)
    GetByEmail(email string) (*models.User, error)
    Update(user *models.User) error
    Delete(id uint) error
}

type userRepository struct {
    db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
    return &userRepository{db: db}
}

func (r *userRepository) Create(user *models.User) error {
    return r.db.Create(user).Error
}

func (r *userRepository) GetByID(id uint) (*models.User, error) {
    var user models.User
    err := r.db.First(&user, id).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

### 3. 服务层 (Service)
```go
// services/user_service.go
package services

import (
    "devSwipe/internal/models"
    "devSwipe/internal/repositories"
    "errors"
    "golang.org/x/crypto/bcrypt"
)

type UserService interface {
    Register(user *models.User) error
    Login(email, password string) (*models.User, error)
    GetProfile(id uint) (*models.User, error)
    UpdateProfile(user *models.User) error
}

type userService struct {
    userRepo repositories.UserRepository
}

func NewUserService(userRepo repositories.UserRepository) UserService {
    return &userService{userRepo: userRepo}
}

func (s *userService) Register(user *models.User) error {
    // 密码加密
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    user.Password = string(hashedPassword)

    return s.userRepo.Create(user)
}
```

### 4. 处理器层 (Handler)
```go
// handlers/user_handler.go
package handlers

import (
    "devSwipe/internal/services"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
)

type UserHandler struct {
    userService services.UserService
}

func NewUserHandler(userService services.UserService) *UserHandler {
    return &UserHandler{userService: userService}
}

func (h *UserHandler) Register(c *gin.Context) {
    var req struct {
        Username string `json:"username" binding:"required"`
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required,min=6"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // 处理注册逻辑
    c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}
```

## 文件结构规范

```
backend/
├── internal/
│   ├── config/            # 配置管理
│   │   └── config.go
│   ├── models/           # 数据库模型
│   │   ├── user.go
│   │   ├── project.go
│   │   ├── interaction.go
│   │   └── types.go
│   ├── handlers/         # HTTP 处理器
│   │   ├── user_handler.go
│   │   ├── project_handler.go
│   │   └── interaction_handler.go
│   ├── services/         # 业务逻辑层
│   │   ├── user_service.go
│   │   ├── project_service.go
│   │   ├── interaction_service.go
│   │   └── recommendation_service.go
│   ├── repositories/     # 数据访问层
│   │   ├── user_repository.go
│   │   ├── project_repository.go
│   │   └── interaction_repository.go
│   └── middleware/       # 中间件
│       ├── auth.go
│       └── cors.go
├── pkg/                 # 公共包
│   └── utils/           # 工具函数
│       └── json.go
├── cmd/                # 应用入口
│   └── main.go
├── scripts/            # 数据库和部署脚本
│   ├── init.sql        # 数据库架构
│   └── update_json_to_text.sql
├── go.mod
├── go.sum
└── .env
```

## 数据库设计规范

### 1. 命名规范
- 表名：复数形式，小写，下划线分隔
- 字段名：小写，下划线分隔
- 索引名：`idx_表名_字段名`
- 外键名：`fk_表名_字段名`

### 2. 字段类型
```sql
-- 用户表
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    tech_stack JSON,
    bio TEXT,
    avatar_url VARCHAR(255),
    followers_count INT UNSIGNED DEFAULT 0,
    following_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_deleted_at (deleted_at)
);
```

## API 设计规范

### 1. RESTful API
```
GET    /api/v1/projects          # 获取项目列表
GET    /api/v1/projects/:id      # 获取单个项目
POST   /api/v1/projects          # 创建项目
PUT    /api/v1/projects/:id      # 更新项目
DELETE /api/v1/projects/:id      # 删除项目

GET    /api/v1/users/:id         # 获取用户信息
PUT    /api/v1/users/:id         # 更新用户信息
POST   /api/v1/auth/login        # 用户登录
POST   /api/v1/auth/register     # 用户注册
```

### 2. 响应格式
```json
// 成功响应
{
  "success": true,
  "data": {
    // 具体数据
  },
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入数据验证失败",
    "details": {
      "field": "error message"
    }
  }
}
```

---

# 通用开发规范

## 代码风格

### 1. 命名规范
- **文件名**: kebab-case (user-service.ts, project_card.tsx)
- **变量名**: camelCase (userName, projectId)
- **常量名**: UPPER_SNAKE_CASE (API_BASE_URL, MAX_FILE_SIZE)
- **函数名**: camelCase (getUserById, handleSubmit)
- **类名/组件名**: PascalCase (UserService, ProjectCard)

### 2. TypeScript 类型定义
```typescript
// types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  techStack: string[];
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  images: string[];
  techStack: string[];
  status: 'draft' | 'published' | 'archived';
  userId: number;
  createdAt: string;
  updatedAt: string;
}
```

## Git 工作流

### 1. 分支命名规范
- `main` - 主分支
- `develop` - 开发分支
- `feature/功能名称` - 功能分支
- `bugfix/问题描述` - 修复分支
- `hotfix/紧急修复` - 热修复分支

### 2. 提交信息规范
```
type(scope): description

type: feat, fix, docs, style, refactor, test, chore
scope: 影响范围 (如: frontend, backend, api)
description: 简短描述 (中文)

示例:
feat(frontend): 添加项目卡片滑动功能
fix(backend): 修复用户注册密码验证问题
docs(api): 更新API文档
```

## 环境配置

### 1. 前端环境变量
```bash
# .env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

### 2. 后端环境变量
```bash
# .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=devswipe
DB_PASSWORD=password
DB_NAME=devswipe

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

SERVER_PORT=8080
GIN_MODE=debug
```

## 测试规范

### 1. 前端测试
```tsx
// 使用 Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from '../components/ProjectCard';

test('renders project card with title', () => {
  const mockProject = {
    id: 1,
    title: 'Test Project',
    description: 'Test Description',
  };

  render(<ProjectCard project={mockProject} onLike={jest.fn()} onPass={jest.fn()} />);

  expect(screen.getByText('Test Project')).toBeInTheDocument();
});
```

### 2. 后端测试
```go
// 使用 testify
package services_test

import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

func TestUserService_Register(t *testing.T) {
    // 测试用户注册服务
    mockRepo := new(MockUserRepository)
    service := NewUserService(mockRepo)

    user := &models.User{
        Username: "testuser",
        Email:    "test@example.com",
        Password: "password123",
    }

    mockRepo.On("Create", mock.AnythingOfType("*models.User")).Return(nil)

    err := service.Register(user)

    assert.NoError(t, err)
    mockRepo.AssertExpectations(t)
}
```

---

# 部署规范

## Docker 配置

### 1. 前端 Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. 后端 Dockerfile
```dockerfile
FROM golang:1.24-alpine as builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main cmd/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

## docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: devswipe
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

---

## 安全规范

### 1. 前端安全
- 输入验证和清理
- XSS 防护
- CSRF 保护
- 敏感数据加密存储

### 2. 后端安全
- JWT 认证
- 密码哈希 (bcrypt)
- SQL 注入防护
- CORS 配置
- 请求频率限制

---

*本规范文档会随项目发展持续更新，请确保团队成员及时了解最新版本。*