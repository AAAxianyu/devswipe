FROM golang:1.24 AS builder

WORKDIR /app

# 安装必要的包
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# 复制go mod文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# 最终镜像
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates tzdata && rm -rf /var/lib/apt/lists/*

WORKDIR /root/

# 从builder阶段复制二进制文件
COPY --from=builder /app/main .

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["./main"]
