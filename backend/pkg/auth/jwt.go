package auth

import (
	"errors"
	"time"

	"devswipe-backend/internal/config"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID   int64  `json:"user_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	jwt.RegisteredClaims
}

var jwtSecret []byte

func InitJWT() {
	jwtSecret = []byte(config.AppConfig.JWT.SecretKey)
}

func GenerateToken(userID int64, username, email string) (string, error) {
	expirationTime := time.Now().Add(time.Duration(config.AppConfig.JWT.ExpiresIn) * time.Hour)

	claims := &Claims{
		UserID:   userID,
		Username: username,
		Email:    email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

func RefreshToken(tokenString string) (string, error) {
	claims, err := ValidateToken(tokenString)
	if err != nil {
		return "", err
	}

	// 检查token是否即将过期（1小时内）
	if time.Until(claims.ExpiresAt.Time) > time.Hour {
		return "", errors.New("token is not close to expiration")
	}

	// 生成新token
	return GenerateToken(claims.UserID, claims.Username, claims.Email)
}
