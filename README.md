# DevSwipe - 开发者项目展示平台

DevSwipe是一个类似Tinder的开发者项目展示平台，支持项目滑动浏览、交互评价、个性化推荐等功能。

## 功能特性

- 🔐 **用户认证系统** - 注册、登录、JWT认证
- 📱 **项目浏览** - 类似Tinder的滑动交互体验
- 🎯 **智能推荐** - 基于用户偏好的个性化推荐算法
- 💬 **互动功能** - 喜欢、不喜欢、超级喜欢、跳过、评论
- 📊 **数据分析** - 项目统计和用户行为分析
- 🏷️ **标签系统** - 技术栈和项目分类标签
- 👥 **社交功能** - 用户关注、收藏夹
- 📱 **响应式设计** - 支持移动端和桌面端

## 技术栈

### 后端
- **Go 1.21+** - 主要编程语言
- **Gin** - Web框架
- **GORM** - ORM框架
- **MySQL 8.0** - 主数据库
- **Redis 7.0** - 缓存和会话存储
- **JWT** - 身份认证

### 前端
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Redux Toolkit** - 状态管理
- **React Router** - 路由管理

### 部署
- **Docker** - 容器化
- **docker-compose** - 服务编排
- **Nginx** - 反向代理

## 快速开始

### 环境要求

- Docker & Docker Compose
- Go 1.21+ (本地开发)
- Node.js 18+ (本地开发)

### 使用Docker运行

1. **克隆项目**
```bash
git clone <repository-url>
cd devswipe
```

2. **启动服务**
```bash
docker-compose up -d
```

3. **访问应用**
- 前端: http://localhost:3000
- 后端API: http://localhost:8080
- 数据库: localhost:3306
- Redis: localhost:6379

### 本地开发

#### 后端开发

1. **安装依赖**
```bash
cd backend
go mod tidy
```

2. **配置环境变量**
```bash
cp env.example .env
# 编辑.env文件，配置数据库和Redis连接信息
```

3. **启动服务**
```bash
go run cmd/server/main.go
```

#### 前端开发

1. **安装依赖**
```bash
cd frontend
npm install
```

2. **启动开发服务器**
```bash
npm start
```

## API文档

### 认证接口

- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录

### 用户接口

- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me` - 更新用户信息
- `POST /api/v1/users/{id}/follow` - 关注用户
- `DELETE /api/v1/users/{id}/follow` - 取消关注

### 项目接口

- `GET /api/v1/projects/feed` - 获取项目浏览流
- `GET /api/v1/projects/{id}` - 获取项目详情
- `POST /api/v1/projects` - 创建项目
- `PUT /api/v1/projects/{id}` - 更新项目
- `DELETE /api/v1/projects/{id}` - 删除项目
- `POST /api/v1/projects/{id}/interact` - 项目交互
- `POST /api/v1/projects/{id}/comments` - 添加评论
- `GET /api/v1/projects/{id}/comments` - 获取评论

## 数据库设计

### 核心表结构

- **users** - 用户表
- **projects** - 项目表
- **project_tags** - 项目标签关联表
- **user_interactions** - 用户交互表
- **comments** - 评论表
- **collections** - 收藏夹表
- **user_follows** - 用户关注表

详细的数据库设计请参考 `backend/scripts/init.sql` 文件。

## 推荐算法

系统使用多因子推荐算法，综合考虑：

1. **标签匹配** (40%) - 基于用户历史交互的标签偏好
2. **项目热度** (30%) - 基于喜爱率和参与度
3. **时间新鲜度** (20%) - 新项目获得更高权重
4. **用户相似度** (10%) - 基于关注关系和共同偏好

## 项目结构

```
devswipe/
├── backend/                 # Go后端
│   ├── cmd/server/         # 应用入口
│   ├── internal/           # 内部包
│   │   ├── config/        # 配置
│   │   ├── models/        # 数据模型
│   │   ├── handlers/      # HTTP处理器
│   │   ├── services/      # 业务逻辑
│   │   ├── repositories/  # 数据访问层
│   │   └── middleware/    # 中间件
│   ├── pkg/               # 公共包
│   │   ├── database/      # 数据库连接
│   │   ├── auth/          # 认证相关
│   │   └── cache/         # 缓存管理
│   └── scripts/           # 数据库脚本
├── frontend/               # React前端
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # 自定义Hooks
│   │   ├── services/      # API服务
│   │   ├── store/         # Redux状态管理
│   │   └── types/         # TypeScript类型
│   └── public/            # 静态资源
├── docker-compose.yml     # Docker编排文件
└── README.md             # 项目说明
```

## 开发指南

### 代码规范

- Go代码遵循标准Go代码规范
- React组件使用函数式组件和Hooks
- TypeScript严格模式
- 使用Prettier和ESLint进行代码格式化

### 测试

```bash
# 后端测试
cd backend
go test ./...

# 前端测试
cd frontend
npm test
```

### 部署

生产环境部署请参考 `deployments/` 目录下的配置文件。

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目链接: [https://github.com/your-username/devswipe](https://github.com/your-username/devswipe)
- 问题反馈: [Issues](https://github.com/your-username/devswipe/issues)

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础功能实现
- 用户认证系统
- 项目浏览和交互
- 推荐算法
- Docker部署支持
