package config

import (
	"log"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	JWT      JWTConfig
}

type ServerConfig struct {
	Port string
	Host string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type JWTConfig struct {
	SecretKey string
	ExpiresIn int // hours
}

var AppConfig *Config

func LoadConfig() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	viper.SetDefault("server.port", "8080")
	viper.SetDefault("server.host", "localhost")
	viper.SetDefault("database.host", "localhost")
	viper.SetDefault("database.port", "3306")
	viper.SetDefault("database.user", "devswipe")
	viper.SetDefault("database.password", "devswipe_password")
	viper.SetDefault("database.dbname", "devswipe")
	viper.SetDefault("redis.host", "localhost")
	viper.SetDefault("redis.port", "6379")
	viper.SetDefault("redis.password", "")
	viper.SetDefault("redis.db", 0)
	viper.SetDefault("jwt.secret_key", "your-secret-key")
	viper.SetDefault("jwt.expires_in", 24)

	// Override with environment variables
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	AppConfig = &Config{
		Server: ServerConfig{
			Port: viper.GetString("server.port"),
			Host: viper.GetString("server.host"),
		},
		Database: DatabaseConfig{
			Host:     viper.GetString("database.host"),
			Port:     viper.GetString("database.port"),
			User:     viper.GetString("database.user"),
			Password: viper.GetString("database.password"),
			DBName:   viper.GetString("database.dbname"),
		},
		Redis: RedisConfig{
			Host:     viper.GetString("redis.host"),
			Port:     viper.GetString("redis.port"),
			Password: viper.GetString("redis.password"),
			DB:       viper.GetInt("redis.db"),
		},
		JWT: JWTConfig{
			SecretKey: viper.GetString("jwt.secret_key"),
			ExpiresIn: viper.GetInt("jwt.expires_in"),
		},
	}
}
