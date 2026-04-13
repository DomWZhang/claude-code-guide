# MCP (Model Context Protocol) 集成

MCP（Model Context Protocol）是 Anthropic 推出的开放标准协议，用于连接 Claude Code 与外部工具、数据源和服务。通过 MCP，你可以让 Claude Code 直接与 GitHub、数据库、Slack 等外部系统交互。

## MCP 概述

### 什么是 MCP？

MCP 是一种标准化协议，定义了 AI 模型与外部工具之间的通信规范。它解耦了 AI 能力与具体工具实现——只需配置一次，就能让 Claude Code 使用任意支持 MCP 的服务。

```
传统方式：
Claude Code → 自定义脚本 → 外部服务（维护成本高）

MCP 方式：
Claude Code → MCP Client → MCP Server → 外部服务（标准化、即插即用）
```

### MCP vs 内置工具

| 特性 | 内置工具 | MCP 工具 |
|------|----------|----------|
| 标准化 | 无 | MCP 协议 |
| 扩展性 | 固定 | 无限 |
| 配置方式 | CLI 内置 | 配置文件 |
| 安全模型 | 沙箱保护 | 按服务器配置 |
| 生态 | 基础功能（文件、Git、Shell） | 丰富（GitHub、数据库、Slack 等） |

## MCP 架构

### 组件关系

```
┌──────────────────────────────────────────────────────────────┐
│                        Claude Code (Host)                     │
│  - MCP Client：管理连接、发送请求、接收结果                     │
│  - 工具调用：Claude 决定调用哪个 MCP 工具                     │
└──────────────────────────────────────────────────────────────┘
                              │
                         MCP Protocol
                        (JSON-RPC 2.0)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
     │  Filesystem │ │   GitHub    │ │  PostgreSQL │
     │   Server    │ │   Server    │ │   Server    │
     └─────────────┘ └─────────────┘ └─────────────┘
     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
     │   Slack     │ │   Notion    │ │  Search API │
     │   Server    │ │   Server    │ │   Server    │
     └─────────────┘ └─────────────┘ └─────────────┘
```

### 通信流程

```
1. MCP Server 启动，注册可用工具列表
         ↓
2. Claude Code 连接 Server，获取工具定义
         ↓
3. Claude 分析用户请求，决定调用哪些工具
         ↓
4. 通过 MCP 协议发送 JSON-RPC 请求
         ↓
5. MCP Server 执行实际操作（API 调用、文件读取等）
         ↓
6. 返回结果给 Claude Code
         ↓
7. Claude 分析结果，继续或返回给用户
```

### 传输类型

MCP Server 支持两种主要传输方式：

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| **stdio** | 通过标准输入/输出通信 | 本地命令、npm 包 |
| **HTTP/SSE** | 通过 HTTP 协议通信 | 远程服务、Web API |

## MCP 服务器管理

Claude Code 提供 `claude mcp` 命令用于管理 MCP 服务器。

### 查看已配置的服务器

```bash
# 列出所有 MCP 服务器
claude mcp list

# 查看特定服务器详情
claude mcp get <server-name>
```

### 添加 MCP 服务器

#### 通过 npx 添加 stdio 服务器

```bash
# 添加官方 Filesystem 服务器
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /allowed/path

# 添加官方 GitHub 服务器
claude mcp add github -- npx -y @modelcontextprotocol/server-github

# 添加官方 PostgreSQL 服务器
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres
```

#### 通过 HTTP/SSE 添加远程服务器

```bash
# 添加 HTTP 服务器
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 添加带认证头的 HTTP 服务器
claude mcp add --transport http corridor https://app.corridor.dev/api/mcp \
  --header "Authorization: Bearer YOUR_TOKEN"
```

#### 通过 JSON 添加服务器

```bash
# 直接传入 JSON 配置
claude mcp add-json my-server '{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
  "env": {}
}'
```

#### 从 Claude Desktop 导入

```bash
# 从 Claude Desktop 配置导入（macOS 和 WSL）
claude mcp add-from-claude-desktop
```

### 移除 MCP 服务器

```bash
claude mcp remove <server-name>
```

### 重置项目服务器选择

```bash
# 重置项目中所有已批准/拒绝的服务器选择
claude mcp reset-project-choices
```

### 启动 MCP 服务器（开发）

```bash
# 启动 Claude Code MCP 服务器，供其他客户端使用
claude mcp serve
```

## 常用 MCP 服务器

### 1. Filesystem（文件系统）

**包名**：`@modelcontextprotocol/server-filesystem`
**功能**：完整的文件系统访问

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem \
  ~/projects \
  /tmp/shared
```

**可用工具**：
- `read_file` — 读取文件
- `read_multiple_files` — 批量读取多个文件
- `write_file` — 写入文件
- `edit_file` — 编辑文件（精确替换）
- `create_directory` — 创建目录
- `list_directory` — 列出目录
- `move_file` — 移动文件
- `delete_file` — 删除文件

### 2. GitHub

**包名**：`@modelcontextprotocol/server-github`
**功能**：GitHub API 集成

```bash
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

> 需要设置 `GITHUB_TOKEN` 环境变量：
> ```bash
> GITHUB_TOKEN=ghp_xxxx claude mcp add github -- npx -y @modelcontextprotocol/server-github
> ```
>
> 或在交互式添加时输入。

**可用工具**：
- `github_get_repository` — 获取仓库信息
- `github_search_repositories` — 搜索仓库
- `github_list_issues` — 列出 Issue
- `github_create_issue` — 创建 Issue
- `github_create_pull_request` — 创建 PR
- `github_list_pull_requests` — 列出 PR
- `github_get_file_contents` — 获取文件内容
- `github_create_or_update_file` — 创建/更新文件

### 3. PostgreSQL

**包名**：`@modelcontextprotocol/server-postgres`
**功能**：PostgreSQL 数据库查询

```bash
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres
```

**可用工具**：
- `postgres_query` — 执行 SQL 查询
- `postgres_execute` — 执行 SQL 语句（INSERT/UPDATE/DELETE）

### 4. Filesystem（项目限制版）

如果你只需要让 Claude 访问特定目录，可以使用官方 Filesystem 服务器并限制访问范围：

```bash
# 仅允许访问项目目录
claude mcp add project-fs -- npx -y @modelcontextprotocol/server-filesystem \
  "$(pwd)"
```

### 5. 社区 MCP 服务器

MCP 生态中有大量社区维护的服务器。以下是一些常用选择：

| 服务器 | 包名 | 功能 |
|--------|------|------|
| **Brave Search** | `@modelcontextprotocol/server-brave-search` | 网页搜索 |
| **AWS KB Retrieval** | `@modelcontextprotocol/server-aws-kb-retrieval` | AWS 知识库 |
| **Google Maps** | `@modelcontextprotocol/server-google-maps` | 地图和地理编码 |
| **Slack** | `@modelcontextprotocol/server-slack` | Slack 消息 |

搜索更多 MCP 服务器：

```bash
npm search @modelcontextprotocol/server
npm search mcp-server
```

## MCP 配置详解

### 全局配置

MCP 服务器的全局配置位于 `~/.claude/settings.json`（通过 Claude Code 内部管理）。使用 `claude mcp add` 添加的服务器会自动配置。

### 项目级配置（.mcp.json）

在项目根目录创建 `.mcp.json`，可以为特定项目配置 MCP 服务器：

```json
{
  "mcpServers": {
    "project-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/myapp"
      }
    },
    "project-files": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./docs", "./data"]
    }
  }
}
```

项目级配置会覆盖全局配置，且每个服务器都会显示信任确认对话框。

### 配置参数说明

```json
{
  "command": "npx",           // 启动命令（npx, node, python, docker 等）
  "args": ["-y", "..."],      // 命令参数
  "env": {},                  // 环境变量
  "disabled": false           // 是否禁用（可选）
}
```

### 多个 MCP 配置

使用 `--mcp-config` 加载多个配置文件：

```bash
claude --mcp-config ./mcp.json --mcp-config ./dev-mcp.json
```

使用 `--strict-mcp-config` 仅使用指定配置：

```bash
claude --strict-mcp-config --mcp-config ./prod-mcp.json
```

## MCP 工具调用示例

### 示例 1：GitHub Issue 管理

```bash
# 确保已添加 GitHub MCP
claude mcp add github -- npx -y @modelcontextprotocol/server-github

# 在 Claude Code 会话中
请在当前仓库创建一个 Issue，标题为 "优化数据库查询性能"，内容包含：
- 问题描述
- 预期行为
- 复现步骤
```

### 示例 2：数据库查询

```bash
# 添加 PostgreSQL MCP
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres

# 在 Claude Code 会话中
查询 users 表中最近一周注册的用户数量，并按来源分组统计
```

### 示例 3：文件系统受限访问

```bash
# 仅允许访问 docs 目录
claude mcp add docs -- npx -y @modelcontextprotocol/server-filesystem ./docs

# 在 Claude Code 会话中
请总结 docs/ 目录下所有 Markdown 文件的主要内容
```

## MCP 安全考量

### 信任确认

首次在项目中使用 MCP 服务器时，Claude Code 会显示信任确认对话框：

```
⚠️ 检测到项目级 MCP 配置
服务器：project-db
命令：npx @modelcontextprotocol/server-postgres
是否信任此 MCP 服务器？[信任] [拒绝] [全部信任]
```

### 权限控制

- **全局服务器**：所有项目均可使用
- **项目级服务器（.mcp.json）**：仅在对应项目中可用，需确认
- **使用 `--dangerously-skip-permissions`**：跳过所有确认（危险）

### 敏感信息处理

MCP 服务器配置中的环境变量（如 `GITHUB_TOKEN`、`DATABASE_URL`）会暴露给 MCP Server 进程。推荐做法：

1. **不将 `GITHUB_TOKEN` 等密钥提交到 `.mcp.json`**（使用 `.gitignore` 排除）
2. **在终端中设置环境变量**：

```bash
export GITHUB_TOKEN=ghp_xxxx
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

## 常见问题

### Q: MCP 服务器启动失败？

```bash
# 诊断 MCP 问题
claude --debug mcp

# 检查服务器是否在列表中
claude mcp list

# 查看服务器详情
claude mcp get <server-name>
```

### Q: MCP 服务器需要网络访问吗？

stdio 服务器（如 `npx -y @modelcontextprotocol/server-*`）需要下载包。HTTP/SSE 服务器（如 Sentry）需要稳定的网络连接。

### Q: 如何限制 MCP 工具的访问范围？

Filesystem 服务器可通过参数限制访问目录：

```bash
claude mcp add limited-fs -- npx -y @modelcontextprotocol/server-filesystem \
  /allowed/path1 \
  /allowed/path2
```

### Q: 可以同时使用多少个 MCP 服务器？

没有硬性限制，但每个服务器的启动和工具定义都会占用上下文空间。建议同时使用不超过 10 个活跃服务器。

### Q: MCP 服务器的包找不到？

确保使用正确的包名：

```bash
# 正确（官方包）
@modelcontextprotocol/server-filesystem
@modelcontextprotocol/server-github

# 错误（这些包不存在）
@anthropic-ai/mcp-server-filesystem
```

### Q: 如何开发自己的 MCP 服务器？

参考官方 SDK：

```bash
npm install @modelcontextprotocol/sdk
```

官方 MCP 协议规范：[github.com/modelcontextprotocol/specification](https://github.com/modelcontextprotocol/specification)

::: tip
MCP 生态发展迅速，定期运行 `npm search @modelcontextprotocol/server` 发现新的服务器。
:::
