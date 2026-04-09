# 项目模板

本节提供各种场景下的 CLAUDE.md 模板，帮助你快速创建项目配置。

## React 项目模板

```markdown
# My React App

## 项目信息
- 项目名称: My React App
- 描述: 现代化的 React 单页应用
- 技术栈: React 18, TypeScript, Vite, Tailwind CSS, Zustand

## 技术规范

### 代码规范
- TypeScript 严格模式
- 2 空格缩进
- 行长度最多 100 字符
- 使用单引号字符串
- 末尾添加分号

### 组件规范
- 使用函数组件 + Hooks
- 组件文件最多 200 行
- Props 使用 TypeScript 接口
- 使用 CSS Modules 或 Tailwind

### 文件组织
src/
├── components/     # UI 组件
│   ├── common/     # 通用组件
│   └── features/   # 业务组件
├── hooks/          # 自定义 Hooks
├── utils/          # 工具函数
├── types/          # 类型定义
├── api/            # API 调用
├── stores/         # Zustand stores
└── pages/          # 页面组件

### 命名规范
- 组件: PascalCase (UserCard.tsx)
- Hooks: camelCase 前缀 use (useUser.ts)
- 工具函数: camelCase (formatDate.ts)
- 常量: UPPER_SNAKE_CASE
- 类型: PascalCase (UserProfile)

### 测试要求
- 核心逻辑必须有单元测试
- 组件必须有快照测试
- 测试文件在 __tests__ 或 .test.ts(x)

## Git 规范

### 分支命名
- feature/xxx
- fix/xxx
- hotfix/xxx
- refactor/xxx

### Commit 格式
<type>(<scope>): <subject>

feat(auth): 添加用户登录功能
fix(api): 修复订单查询错误
docs(readme): 更新使用文档

### 类型
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建/工具

## 常用命令
- npm run dev: 启动开发服务器
- npm test: 运行测试
- npm run build: 构建生产版本
- npm run lint: 代码检查

## 环境变量
- VITE_API_URL: API 地址
- VITE_APP_TITLE: 应用标题

---

role: 经验丰富的 React 全栈工程师
expertise:
  - React 18
  - TypeScript
  - 函数式编程
  - 性能优化

workingStyle:
  - 先理解需求
  - 编写测试
  - 实现功能
  - 代码审查
```

## Node.js 后端项目模板

```markdown
# My Node.js API

## 项目信息
- 项目名称: My API
- 描述: Node.js RESTful API 服务
- 技术栈: Node.js, Express, TypeScript, PostgreSQL, Prisma

## 技术规范

### 代码规范
- TypeScript 严格模式
- 4 空格缩进
- 使用 async/await
- 统一错误处理
- 参数验证

### API 设计
- RESTful 规范
- URL 使用名词
- 版本控制 /api/v1/
- 统一响应格式

### 响应格式
{
  "success": true,
  "data": {},
  "error": null
}

### 错误码
- 400: 参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

### 目录结构
src/
├── controllers/    # 控制器
├── services/       # 业务逻辑
├── repositories/   # 数据访问
├── models/         # 数据模型
├── middlewares/    # 中间件
├── routes/         # 路由
├── utils/           # 工具
└── types/           # 类型定义

## 数据库规范
- 表名: snake_case 复数 (users, orders)
- 列名: snake_case (user_name, created_at)
- 主键: id (UUID)
- 时间戳: created_at, updated_at
- 软删除: deleted_at

## 安全规范
- 使用 JWT 认证
- 密码必须加密 (bcrypt)
- 输入验证
- SQL 注入防护
- XSS 防护

## 测试要求
- 单元测试覆盖率 > 80%
- 集成测试覆盖 API 端点
- 使用 Jest
```

## 全栈项目模板

```markdown
# My Full-Stack App

## 项目概述
现代化全栈 Web 应用

## 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Vite

### 后端
- Node.js
- Express
- PostgreSQL

### DevOps
- Docker
- GitHub Actions

## 项目结构
/
├── client/          # 前端代码
├── server/          # 后端代码
├── shared/          # 共享代码/类型
├── infra/           # 基础设施
├── docker-compose.yml
└── CLAUDE.md

## 工作流程

### 开发流程
1. 创建功能分支
2. 开发前端和后端
3. 编写测试
4. 代码审查
5. 合并到 main

### API 开发
1. 定义接口（共享类型）
2. 实现后端
3. 实现前端
4. 端到端测试
```

## Python 项目模板

```markdown
# My Python Project

## 项目信息
- 项目名称: My Python App
- 描述: Python 数据处理应用
- 技术栈: Python 3.11, FastAPI, PostgreSQL, Docker

## 代码规范

### PEP 8
- 4 空格缩进
- 行长度 79 字符
- 使用类型提示
- docstring 文档

### 命名
- 模块: snake_case
- 类: PascalCase
- 函数: snake_case
- 常量: UPPER_SNAKE_CASE

### 项目结构
src/
├── models/         # 数据模型
├── schemas/        # Pydantic schemas
├── api/            # API 路由
├── services/       # 业务逻辑
├── repositories/   # 数据访问
└── core/           # 核心配置
```

## 小型脚本项目模板

```markdown
# My Scripts

## 项目描述
日常使用的自动化脚本集合

## 脚本分类

### 部署脚本
- deploy.sh: 部署应用到服务器
- rollback.sh: 回滚到上一版本

### 开发脚本
- dev.sh: 启动开发环境
- test.sh: 运行测试

### 维护脚本
- backup.sh: 备份数据
- cleanup.sh: 清理临时文件
- monitor.sh: 监控系统状态

## 使用方法
每个脚本都有 --help 选项
./scripts/deploy.sh --help
```

## CLI 工具项目模板

```markdown
# My CLI Tool

## 项目信息
- 项目名称: mycli
- 描述: 命令行工具
- 技术栈: Node.js, Commander.js

## 使用方法
mycli [command] [options]

Commands:
  start     启动服务
  stop     停止服务
  status   查看状态
  config   配置管理

Options:
  --help   显示帮助
  --version 显示版本
```

## 静态网站模板

```markdown
# My Static Site

## 项目信息
- 项目名称: My Site
- 描述: 个人网站
- 技术栈: VitePress, Markdown

## 内容结构
docs/
├── guide/          # 指南
├── api/            # API 文档
└── index.md        # 首页
```

## 使用模板

### 1. 选择合适的模板

根据项目类型选择模板：
- React/前端 → React 项目模板
- Node.js 后端 → Node.js 模板
- 全栈 → 全栈模板
- Python → Python 模板

### 2. 自定义模板

复制模板并根据项目调整：
- 修改项目名称
- 调整技术栈
- 自定义规则
- 添加团队规范

### 3. 持续更新

定期审查 CLAUDE.md 配置：
- 是否还合适？
- 需要添加新的规范吗？
- 移除不适用的规则

::: tip 模板复用
创建适合自己项目的模板，并在多个项目中复用，可以快速建立一致的编码规范和工作流程。
:::
