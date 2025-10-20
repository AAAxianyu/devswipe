package models

import (
	"database/sql/driver"
	"encoding/json"
)

// JSONArray 自定义类型用于处理JSON数组
type JSONArray []string

// Value 实现 driver.Valuer 接口
func (j JSONArray) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan 实现 sql.Scanner 接口
func (j *JSONArray) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return json.Unmarshal([]byte(value.(string)), j)
	}

	return json.Unmarshal(bytes, j)
}


