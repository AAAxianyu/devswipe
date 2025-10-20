-- DevSwipe 数据库初始化脚本

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS devswipe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE devswipe;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    tech_stack JSON,
    is_creator BOOLEAN DEFAULT FALSE,
    follower_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    image_urls JSON,
    project_url VARCHAR(500),
    status ENUM('concept', 'demo', 'mvp', 'launched') DEFAULT 'demo',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    super_like_count INT DEFAULT 0,
    skip_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    completion_rate FLOAT DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status),
    FULLTEXT idx_search (title, description)
);

-- 项目标签关联表
CREATE TABLE IF NOT EXISTS project_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    tag_type ENUM('tech', 'domain', 'function', 'stage', 'hackathon') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_tag (project_id, tag_name),
    INDEX idx_tag_name (tag_name),
    INDEX idx_tag_type (tag_type)
);

-- 用户交互表
CREATE TABLE IF NOT EXISTS user_interactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    interaction_type ENUM('like', 'dislike', 'super_like', 'skip', 'bookmark') NOT NULL,
    structured_feedback ENUM('not_interested', 'unclear_problem', 'easy_tech', 'existing_products', 'poor_demo') NULL,
    session_id VARCHAR(100),
    view_duration FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_project_interaction (user_id, project_id, interaction_type),
    INDEX idx_user_id (user_id),
    INDEX idx_project_id (project_id),
    INDEX idx_created_at (created_at)
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    parent_id BIGINT,
    content TEXT NOT NULL,
    is_technical BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
);

-- 收藏夹表
CREATE TABLE IF NOT EXISTS collections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    item_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- 收藏项目关联表
CREATE TABLE IF NOT EXISTS collection_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    collection_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_collection_project (collection_id, project_id),
    INDEX idx_project_id (project_id)
);

-- 用户关注表
CREATE TABLE IF NOT EXISTS user_follows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY idx_follower_following (follower_id, following_id),
    INDEX idx_follower_id (follower_id),
    INDEX idx_following_id (following_id)
);

-- 插入示例数据
INSERT IGNORE INTO users (username, email, password_hash, bio, tech_stack, is_creator) VALUES
('demo_user', 'demo@devswipe.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '这是一个演示用户', '["React", "Node.js", "TypeScript"]', true),
('john_doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '全栈开发者', '["JavaScript", "Python", "Go"]', true),
('jane_smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '前端工程师', '["React", "Vue", "CSS"]', true);

-- 插入示例项目
INSERT IGNORE INTO projects (user_id, title, description, image_urls, project_url, status) VALUES
(1, 'DevSwipe 项目展示平台', '一个类似Tinder的开发者项目展示平台，支持滑动浏览、交互评价、个性化推荐等功能。', '["https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=DevSwipe"]', 'https://github.com/devswipe', 'mvp'),
(2, '智能代码审查工具', '基于AI的代码审查工具，能够自动检测代码质量问题并提供改进建议。', '["https://via.placeholder.com/400x300/10B981/FFFFFF?text=Code+Review"]', 'https://github.com/smart-review', 'demo'),
(3, '实时协作编辑器', '支持多人实时协作的在线代码编辑器，类似Google Docs的编程体验。', '["https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Collaborative+Editor"]', 'https://github.com/collab-editor', 'concept');

-- 插入示例标签
INSERT IGNORE INTO project_tags (project_id, tag_name, tag_type) VALUES
(1, 'React', 'tech'),
(1, 'Go', 'tech'),
(1, 'MySQL', 'tech'),
(1, 'Web App', 'domain'),
(2, 'Python', 'tech'),
(2, 'AI', 'tech'),
(2, 'Docker', 'tech'),
(2, 'Developer Tools', 'domain'),
(3, 'WebRTC', 'tech'),
(3, 'React', 'tech'),
(3, 'Node.js', 'tech'),
(3, 'Real-time', 'function');
