package utils

import "encoding/json"

// MustMarshalJSON 将数据序列化为JSON字符串
func MustMarshalJSON(data interface{}) []byte {
	jsonBytes, err := json.Marshal(data)
	if err != nil {
		return []byte("[]")
	}
	return jsonBytes
}

