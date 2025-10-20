package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"devswipe-backend/internal/config"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis() error {
	cfg := config.AppConfig.Redis

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	// 测试连接
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		return fmt.Errorf("failed to connect to Redis: %w", err)
	}

	log.Println("Redis connected successfully")
	return nil
}

func CloseRedis() error {
	if RedisClient == nil {
		return nil
	}
	return RedisClient.Close()
}

// CacheManager 缓存管理器
type CacheManager struct {
	client *redis.Client
}

func NewCacheManager() *CacheManager {
	return &CacheManager{
		client: RedisClient,
	}
}

// Set 设置缓存
func (c *CacheManager) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return c.client.Set(ctx, key, data, expiration).Err()
}

// Get 获取缓存
func (c *CacheManager) Get(ctx context.Context, key string, dest interface{}) error {
	data, err := c.client.Get(ctx, key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(data), dest)
}

// Delete 删除缓存
func (c *CacheManager) Delete(ctx context.Context, key string) error {
	return c.client.Del(ctx, key).Err()
}

// Exists 检查键是否存在
func (c *CacheManager) Exists(ctx context.Context, key string) (bool, error) {
	result, err := c.client.Exists(ctx, key).Result()
	return result > 0, err
}

// 用户相关缓存方法
func (c *CacheManager) CacheUserFeed(ctx context.Context, userID int64, projects interface{}) error {
	key := fmt.Sprintf("user_feed:%d", userID)
	return c.Set(ctx, key, projects, 10*time.Minute)
}

func (c *CacheManager) GetUserFeed(ctx context.Context, userID int64, dest interface{}) error {
	key := fmt.Sprintf("user_feed:%d", userID)
	return c.Get(ctx, key, dest)
}

// 项目相关缓存方法
func (c *CacheManager) CacheProjectStats(ctx context.Context, projectID int64, stats interface{}) error {
	key := fmt.Sprintf("project_stats:%d", projectID)
	return c.Set(ctx, key, stats, 30*time.Minute)
}

func (c *CacheManager) GetProjectStats(ctx context.Context, projectID int64, dest interface{}) error {
	key := fmt.Sprintf("project_stats:%d", projectID)
	return c.Get(ctx, key, dest)
}

// 会话相关缓存方法
func (c *CacheManager) CacheSession(ctx context.Context, sessionID string, data interface{}) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return c.Set(ctx, key, data, 24*time.Hour)
}

func (c *CacheManager) GetSession(ctx context.Context, sessionID string, dest interface{}) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return c.Get(ctx, key, dest)
}
