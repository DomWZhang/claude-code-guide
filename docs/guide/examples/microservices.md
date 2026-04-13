# 实战案例：微服务架构开发

本章通过构建一个完整的微服务系统（订单服务 + 用户服务 + API 网关），展示 Claude Code 在微服务架构开发中的实战应用。

## 项目概述

**系统名称**：EcoShop - 电商微服务平台

**技术栈**：
- 服务框架：FastAPI (Python) + Gin (Go)
- 通信协议：gRPC + REST
- 服务发现：Consul
- 消息队列：RabbitMQ
- 数据库：PostgreSQL (每个服务独立)
- 缓存：Redis
- 容器化：Docker + Docker Compose
- API 网关：Kong

## 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway (Kong)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  用户服务      │     │  订单服务      │     │  产品服务      │
│   (Go/Gin)    │     │ (Python/FastAPI)│   │   (Go/Gin)    │
│  PostgreSQL   │     │  PostgreSQL    │     │  PostgreSQL   │
└───────────────┘     └───────────────┘     └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌───────────────┐
                    │  RabbitMQ     │
                    │  (事件总线)    │
                    └───────────────┘
```

## 第一阶段：项目结构设计

### 创建项目骨架

```
创建微服务项目结构：
ecoshop/
├── docker-compose.yml
├── .env
├── services/
│   ├── user-service/
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── pkg/
│   │   ├── Dockerfile
│   │   └── go.mod
│   ├── order-service/
│   │   ├── app/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── product-service/
│       ├── cmd/
│       ├── internal/
│       ├── Dockerfile
│       └── go.mod
├── api-gateway/
│   └── kong.yml
└── proto/
    ├── user.proto
    ├── order.proto
    └── product.proto
```

Claude Code 执行：

```bash
mkdir -p ecoshop/services/{user-service,order-service,product-service}
mkdir -p ecoshop/api-gateway ecoshop/proto
cd ecoshop
```

## 第二阶段：Protocol Buffers 定义

### 定义 gRPC 接口

```
创建 proto/user.proto，定义用户服务的 gRPC 接口：
- RegisterUser
- GetUser
- UpdateUser
- DeleteUser
- ValidateUser
```

Claude Code 输出：

```protobuf
// proto/user.proto
syntax = "proto3";

package user;

service UserService {
  rpc RegisterUser(RegisterUserRequest) returns (UserResponse);
  rpc GetUser(GetUserRequest) returns (UserResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
  rpc ValidateUser(ValidateUserRequest) returns (ValidateUserResponse);
}

message RegisterUserRequest {
  string email = 1;
  string password = 2;
  string name = 3;
}

message UserResponse {
  string id = 1;
  string email = 2;
  string name = 3;
  string created_at = 4;
}

message GetUserRequest {
  string id = 1;
}

message UpdateUserRequest {
  string id = 1;
  string name = 2;
  string email = 3;
}

message DeleteUserRequest {
  string id = 1;
}

message DeleteUserResponse {
  bool success = 1;
}

message ValidateUserRequest {
  string email = 1;
  string password = 2;
}

message ValidateUserResponse {
  bool valid = 1;
  string user_id = 2;
}
```

### 生成 gRPC 代码

```
为 user.proto 生成 Go 和 Python 代码：
- Go: protoc --go_out=. --go-grpc_out=. proto/user.proto
- Python: python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. proto/user.proto
```

## 第三阶段：用户服务实现 (Go)

### 项目初始化

```
初始化 user-service Go 模块：
cd services/user-service
go mod init github.com/ecoshop/user-service
```

### 数据库模型

```
创建 internal/models/user.go，定义 User 结构体：
- ID (UUID)
- Email (string, unique)
- PasswordHash (string)
- Name (string)
- CreatedAt (time.Time)
- UpdatedAt (time.Time)

使用 GORM 作为 ORM。
```

### 服务实现

```
实现 internal/service/user_service.go：
- RegisterUser: 验证邮箱，哈希密码，保存到数据库
- GetUser: 通过 ID 获取用户信息
- UpdateUser: 更新用户信息
- DeleteUser: 软删除用户
- ValidateUser: 验证用户凭证
```

Claude Code 输出示例：

```go
// internal/service/user_service.go
package service

import (
    "context"
    "errors"
    
    "github.com/google/uuid"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
    
    pb "github.com/ecoshop/user-service/proto"
    "github.com/ecoshop/user-service/internal/models"
)

type UserService struct {
    pb.UnimplementedUserServiceServer
    db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
    return &UserService{db: db}
}

func (s *UserService) RegisterUser(ctx context.Context, req *pb.RegisterUserRequest) (*pb.UserResponse, error) {
    // 验证邮箱是否已存在
    var existing models.User
    if err := s.db.Where("email = ?", req.Email).First(&existing).Error; err == nil {
        return nil, errors.New("email already exists")
    }
    
    // 哈希密码
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }
    
    // 创建用户
    user := models.User{
        ID:           uuid.New().String(),
        Email:        req.Email,
        PasswordHash: string(hashedPassword),
        Name:         req.Name,
    }
    
    if err := s.db.Create(&user).Error; err != nil {
        return nil, err
    }
    
    return &pb.UserResponse{
        Id:        user.ID,
        Email:     user.Email,
        Name:      user.Name,
        CreatedAt: user.CreatedAt.Format(time.RFC3339),
    }, nil
}

func (s *UserService) ValidateUser(ctx context.Context, req *pb.ValidateUserRequest) (*pb.ValidateUserResponse, error) {
    var user models.User
    if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
        return &pb.ValidateUserResponse{Valid: false}, nil
    }
    
    err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
    return &pb.ValidateUserResponse{
        Valid:  err == nil,
        UserId: user.ID,
    }, nil
}
```

### gRPC 服务器启动

```
创建 cmd/main.go，启动 gRPC 服务器：
- 监听端口 50051
- 注册 UserService
- 连接 PostgreSQL
- 优雅关闭
```

## 第四阶段：订单服务实现 (Python/FastAPI)

### 项目初始化

```
初始化 order-service Python 项目：
cd services/order-service
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy asyncpg grpcio grpcio-tools
```

### 数据库模型 (SQLAlchemy)

```
创建 app/models/order.py：
- Order: id, user_id, total_amount, status, created_at, updated_at
- OrderItem: id, order_id, product_id, quantity, price
```

Claude Code 输出：

```python
# app/models/order.py
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
import enum

Base = declarative_base()

class OrderStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
```

### REST API 实现

```
创建 app/routes/orders.py，实现：
- POST /orders: 创建订单
- GET /orders/{id}: 获取订单详情
- GET /orders/user/{user_id}: 获取用户订单列表
- PUT /orders/{id}/status: 更新订单状态
- DELETE /orders/{id}: 取消订单
```

### 与用户服务集成

```
创建 app/services/user_client.py，通过 gRPC 调用用户服务验证用户：
- ValidateUser: 调用 user-service 的 ValidateUser 方法
- GetUser: 获取用户信息用于订单确认
```

## 第五阶段：API 网关配置 (Kong)

### Kong 配置

```
创建 api-gateway/kong.yml，配置：
- 服务：user-service, order-service, product-service
- 路由：/api/users/* -> user-service, /api/orders/* -> order-service
- 插件：
  - rate-limiting (限流)
  - jwt (认证)
  - cors (跨域)
  - prometheus (监控)
```

Claude Code 输出：

```yaml
# api-gateway/kong.yml
_format_version: "3.0"

services:
- name: user-service
  url: http://user-service:50051
  routes:
  - name: user-routes
    paths:
    - /api/users
    strip_path: false
  plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000
  - name: jwt
    config:
      secret_is_base64: false
      claims_to_verify:
      - exp

- name: order-service
  url: http://order-service:8000
  routes:
  - name: order-routes
    paths:
    - /api/orders
    strip_path: false
  plugins:
  - name: rate-limiting
    config:
      minute: 50
      hour: 500

- name: product-service
  url: http://product-service:50052
  routes:
  - name: product-routes
    paths:
    - /api/products
    strip_path: false
  plugins:
  - name: rate-limiting
    config:
      minute: 200
      hour: 2000

plugins:
- name: cors
  config:
    origins:
    - "*"
    methods:
    - GET
    - POST
    - PUT
    - DELETE
    headers:
    - Authorization
    - Content-Type
    exposed_headers:
    - X-Total-Count
    credentials: true

- name: prometheus
  config:
    per_consumer: true
    status_code_metrics: true
    latency_metrics: true
```

## 第六阶段：Docker Compose 编排

### 完整服务编排

```
创建 docker-compose.yml，编排所有服务：
- postgres-user (用户服务数据库)
- postgres-order (订单服务数据库)
- postgres-product (产品服务数据库)
- redis (缓存)
- rabbitmq (消息队列)
- user-service
- order-service
- product-service
- kong (API 网关)
- kong-migrations (Kong 数据库迁移)
```

Claude Code 输出：

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 数据库
  postgres-user:
    image: postgres:15
    environment:
      POSTGRES_DB: userdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres-user-data:/var/lib/postgresql/data
    networks:
      - microservices

  postgres-order:
    image: postgres:15
    environment:
      POSTGRES_DB: orderdb
      POSTGRES_USER: order
      POSTGRES_PASSWORD: password
    volumes:
      - postgres-order-data:/var/lib/postgresql/data
    networks:
      - microservices

  # 缓存
  redis:
    image: redis:7-alpine
    networks:
      - microservices

  # 消息队列
  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    networks:
      - microservices

  # 用户服务
  user-service:
    build: ./services/user-service
    environment:
      DATABASE_URL: postgres://user:password@postgres-user:5432/userdb
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres-user
      - redis
    networks:
      - microservices

  # 订单服务
  order-service:
    build: ./services/order-service
    environment:
      DATABASE_URL: postgresql://order:password@postgres-order:5432/orderdb
      RABBITMQ_URL: amqp://guest:guest@rabbitmq:5672
      USER_SERVICE_URL: http://user-service:50051
    depends_on:
      - postgres-order
      - rabbitmq
    networks:
      - microservices

  # 产品服务
  product-service:
    build: ./services/product-service
    environment:
      DATABASE_URL: postgres://product:password@postgres-product:5432/productdb
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres-product
      - redis
    networks:
      - microservices

  # API 网关
  kong:
    image: kong:3.4
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres-kong
      KONG_PG_DATABASE: kong
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: password
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
    depends_on:
      - postgres-kong
    ports:
      - "8000:8000"
      - "8001:8001"
    networks:
      - microservices

  postgres-kong:
    image: postgres:15
    environment:
      POSTGRES_DB: kong
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: password
    networks:
      - microservices

networks:
  microservices:
    driver: bridge

volumes:
  postgres-user-data:
  postgres-order-data:
  postgres-product-data:
```

## 第七阶段：服务间通信（RabbitMQ）

### 事件定义

```
创建共享事件定义：
- OrderCreatedEvent
- OrderStatusChangedEvent
- UserRegisteredEvent
- ProductStockUpdatedEvent
```

### 订单创建事件发布

```python
# order-service/app/events/publishers.py
import json
import pika
from app.models.order import Order

class OrderEventPublisher:
    def __init__(self, rabbitmq_url: str):
        self.connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
        self.channel = self.connection.channel()
        self.channel.exchange_declare(exchange='order_events', exchange_type='topic')
    
    def publish_order_created(self, order: Order):
        event = {
            'event_type': 'order.created',
            'order_id': str(order.id),
            'user_id': str(order.user_id),
            'total_amount': order.total_amount,
            'timestamp': order.created_at.isoformat()
        }
        self.channel.basic_publish(
            exchange='order_events',
            routing_key='order.created',
            body=json.dumps(event)
        )
```

### 事件消费（产品服务）

```go
// product-service/internal/events/consumer.go
package events

import (
    "encoding/json"
    "log"
    
    amqp "github.com/rabbitmq/amqp091-go"
)

type OrderCreatedEvent struct {
    OrderID     string  `json:"order_id"`
    UserID      string  `json:"user_id"`
    TotalAmount float64 `json:"total_amount"`
    Items       []Item  `json:"items"`
}

type Item struct {
    ProductID string `json:"product_id"`
    Quantity  int    `json:"quantity"`
}

func ConsumeOrderEvents(rabbitmqURL string, productService *ProductService) {
    conn, _ := amqp.Dial(rabbitmqURL)
    defer conn.Close()
    
    ch, _ := conn.Channel()
    defer ch.Close()
    
    ch.ExchangeDeclare("order_events", "topic", true, false, false, false, nil)
    q, _ := ch.QueueDeclare("", false, false, true, false, nil)
    ch.QueueBind(q.Name, "order.created", "order_events", false, nil)
    
    msgs, _ := ch.Consume(q.Name, "", true, false, false, false, nil)
    
    for msg := range msgs {
        var event OrderCreatedEvent
        json.Unmarshal(msg.Body, &event)
        
        // 更新产品库存
        for _, item := range event.Items {
            productService.UpdateStock(item.ProductID, -item.Quantity)
        }
    }
}
```

## 第八阶段：监控与可观测性

### 集成 Prometheus

```
在每个服务中添加 Prometheus 指标：
- 请求计数
- 请求延迟
- 错误率
- 活跃连接数
```

### 集成 Jaeger 链路追踪

```
添加 OpenTelemetry 配置：
- 安装 otel 库
- 初始化 tracer provider
- 在 gRPC/REST 调用中添加 span
```

Claude Code 输出（Go 服务示例）：

```go
// internal/tracing/tracing.go
package tracing

import (
    "context"
    
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/jaeger"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

func InitTracer(serviceName string) func() {
    exporter, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint("http://jaeger:14268/api/traces")))
    if err != nil {
        panic(err)
    }
    
    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(exporter),
        sdktrace.WithResource(resource.NewWithAttributes(
            semconv.SchemaURL,
            semconv.ServiceNameKey.String(serviceName),
        )),
    )
    
    otel.SetTracerProvider(tp)
    
    return func() {
        tp.Shutdown(context.Background())
    }
}
```

## 第九阶段：测试与验证

### 单元测试

```
为 user-service 编写单元测试：
- 测试 RegisterUser（成功、邮箱已存在）
- 测试 ValidateUser（成功、密码错误）
- 测试 GetUser（存在、不存在）
```

### 集成测试

```
编写集成测试：
- 启动 Docker Compose 环境
- 测试端到端流程：用户注册 → 创建订单 → 更新库存
```

### 性能测试

```
使用 k6 进行负载测试：
- 模拟 1000 并发用户
- 测试 API 网关限流
- 测量 p99 延迟
```

## 第十阶段：部署配置

### Kubernetes 部署

```
创建 Kubernetes 部署文件：
- Deployment 配置
- Service 配置
- ConfigMap
- Secret
- Ingress
```

### CI/CD 流水线

```yaml
# .github/workflows/microservices-ci.yml
name: Microservices CI/CD

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test-user-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test User Service
        run: |
          cd services/user-service
          go test ./...
  
  test-order-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test Order Service
        run: |
          cd services/order-service
          pip install -r requirements.txt
          pytest
  
  build-and-push:
    needs: [test-user-service, test-order-service]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker images
        run: |
          docker build -t user-service ./services/user-service
          docker build -t order-service ./services/order-service
          docker push user-service:latest
          docker push order-service:latest
  
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/
```

## 与 Claude Code 的协作要点

1. **分服务开发**：每个服务在独立的 Claude Code 会话中开发
2. **接口先行**：先定义 protobuf/OpenAPI，再实现服务
3. **使用 ECC**：Everything Claude Code 提供微服务开发的最佳实践规则
4. **自动化测试**：让 Claude Code 生成测试代码
5. **文档同步**：每次 API 变更后更新文档

## 总结

| 阶段 | Claude Code 任务 | 产出 |
|------|------------------|------|
| 架构设计 | 生成架构图和项目结构 | 完整项目骨架 |
| 接口定义 | 编写 protobuf/OpenAPI | gRPC 接口定义 |
| 服务实现 | 生成业务代码 | 3 个完整微服务 |
| 基础设施 | 生成 Docker/K8s 配置 | 可部署配置 |
| 可观测性 | 集成监控和追踪 | 完整可观测性 |
| CI/CD | 编写流水线配置 | 自动化部署 |

通过 Claude Code 的辅助，可以在 2-3 天内完成微服务系统的完整开发。
