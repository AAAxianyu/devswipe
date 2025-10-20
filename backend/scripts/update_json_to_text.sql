-- 更新数据库表结构，将JSON字段改为TEXT字段

-- 更新users表的tech_stack字段
ALTER TABLE users MODIFY COLUMN tech_stack TEXT;

-- 更新projects表的image_urls字段  
ALTER TABLE projects MODIFY COLUMN image_urls TEXT;

-- 更新user_preferences表的preferred_tags字段
ALTER TABLE user_preferences MODIFY COLUMN preferred_tags TEXT;

-- 显示更新后的表结构
DESCRIBE users;
DESCRIBE projects;
DESCRIBE user_preferences;



