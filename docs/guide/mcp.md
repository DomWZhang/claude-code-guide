# MCP (Model Context Protocol)

MCP (Model Context Protocol) 是 Anthropic 推出的开放标准协议，用于连接 AI 模型与外部工具和数据源。

## 什么是 MCP？

MCP 是一种标准化协议，让 AI 能够调用外部工具、服务和数据集。

```
┌──────────────────────────────────────────────────────────┐
│                    Claude Code                          │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│              MCP Protocol (标准协议)                     │
└──────────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Filesystem │  │   GitHub    │  │  Database   │
│    MCP      │  │    MCP      │  │    MCP      │
└─────────────┘  └─────────────┘  └─────────────┘
```

## MCP vs 内置工具

| 特性 | 内置工具 | MCP 工具 |
|------|----------|----------|
| 标准化 | 无 | MCP 协议 |
| 扩展性 | 固定 | 无限 |
| 配置 | CLI 内置 | 配置文件 |
| 安全 | 沙箱保护 | 自定义 |
| 生态 | 基础功能 | 丰富生态 |

## MCP 工作原理

### 架构

```
用户请求
    ↓
Claude Code (Host)
    ↓
MCP Client ────── MCP Protocol ────── MCP Server
    ↓                                    ↓
工具定义 ──────────────────────────→  实际工具执行
    ↓                                    ↓
结果返回 ←──────────────────────────  执行结果
```

### 通信流程

```
1. MCP Server 启动
         ↓
2. 声明可用工具列表
         ↓
3. Claude Code 接收工具定义
         ↓
4. Claude 决定调用哪个工具
         ↓
5. 通过 MCP 协议发送请求
         ↓
6. MCP Server 执行工具
         ↓
7. 返回结果给 Claude
```

## 安装 MCP Server

### 通过 npm 安装

```bash
npm install -g @anthropic-ai/mcp-server-filesystem
```

### 通过 pip 安装

```bash
pip install mcp-server-filesystem
```

### 手动安装

```bash
# 克隆 MCP Server 仓库
git clone https://github.com/modelcontextprotocol/server-filesystem.git
cd server-filesystem
npm install
npm run build
```

## 配置 MCP

### 1. 全局配置

在 `~/.claude/` 目录下创建 `mcp.json`：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem"],
      "env": {
        "allowedDirectories": ["/Users/april/projects", "/tmp"]
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "your-github-token"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/db"
      }
    }
  }
}
```

### 2. 项目级配置

在项目根目录创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["/path/to/database-server.js"],
      "env": {
        "DB_PATH": "./data/app.db"
      }
    }
  }
}
```

## 常用 MCP Servers

### 1. Filesystem MCP

文件系统的完整访问：

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-filesystem"],
    "env": {
      "allowedDirectories": ["/Users/april/projects"]
    }
  }
}
```

**可用工具：**
- `read_file` - 读取文件
- `read_multiple_files` - 批量读取
- `write_file` - 写入文件
- `edit_file` - 编辑文件
- `create_directory` - 创建目录
- `list_directory` - 列出目录
- `move_file` - 移动文件
- `delete_file` - 删除文件

### 2. GitHub MCP

GitHub API 集成：

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-github"],
    "env": {
      "GITHUB_TOKEN": "ghp_xxxx"
    }
  }
}
```

**可用工具：**
- `github_get_repository` - 获取仓库信息
- `github_search_repositories` - 搜索仓库
- `github_list_issues` - 列出 Issue
- `github_create_issue` - 创建 Issue
- `github_create_pull_request` - 创建 PR
- `github_list_pull_requests` - 列出 PR
- `github_get_file_contents` - 获取文件内容
- `github_create_or_update_file` - 创建/更新文件

### 3. PostgreSQL MCP

数据库操作：

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
    "env": {
      "DATABASE_URL": "postgresql://localhost:5432/mydb"
    }
  }
}
```

**可用工具：**
- `postgres_query` - 执行 SQL 查询
- `postgres_execute` - 执行 SQL 语句
- `postgres_list_tables` - 列出所有表
- `postgres_describe_table` - 查看表结构

### 4. Slack MCP

Slack 集成：

```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "xoxb-xxxx",
      "SLACK_TEAM_ID": "Txxxx"
    }
  }
}
```

**可用工具：**
- `slack_post_message` - 发送消息
- `slack_list_channels` - 列出频道
- `slack_list_messages` - 获取消息

### 5. Brave Search MCP

网页搜索：

```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": {
      "BRAVE_API_KEY": "your-api-key"
    }
  }
}
```

### 6. Fetch MCP

HTTP 请求：

```json
{
  "fetch": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-fetch"]
  }
}
```

## 创建自定义 MCP Server

### 1. 项目结构

```
my-mcp-server/
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json
```

### 2. 安装依赖

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  }
}
```

### 3. 编写 Server

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js'

// 创建服务器
const server = new Server(
  { name: 'my-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

// 定义工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'my_custom_tool',
        description: '执行自定义操作的工具',
        inputSchema: {
          type: 'object',
          properties: {
            param1: {
              type: 'string',
              description: '参数1说明'
            },
            param2: {
              type: 'number',
              description: '参数2说明'
            }
          },
          required: ['param1']
        }
      }
    ]
  }
})

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name === 'my_custom_tool') {
    // 执行工具逻辑
    const result = await performCustomAction(args.param1, args.param2)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    }
  }

  throw new Error(`Unknown tool: ${name}`)
})

// 启动服务器
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('My MCP Server running on stdio')
}

main().catch(console.error)
```

### 4. 配置使用

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"],
      "env": {
        "API_KEY": "xxx"
      }
    }
  }
}
```

## MCP 工具调用示例

### 示例 1：使用 GitHub MCP

```
帮我查看 anthropics/claude-code 仓库的最新 5 个 issue
```

Claude Code 会调用 GitHub MCP 的 `github_list_issues` 工具。

### 示例 2：使用数据库 MCP

```
查询 users 表中注册时间最近的前 10 个用户
```

Claude Code 会调用 PostgreSQL MCP 的 `postgres_query` 工具。

### 示例 3：组合使用

```
1. 从数据库获取最新订单
2. 在 GitHub 上创建对应的 Issue 记录
3. 发送 Slack 通知团队
```

## MCP 安全

### 权限控制

```json
{
  "mcpServers": {
    "dangerous-server": {
      "command": "...",
      "permissions": {
        "tools": ["tool1", "tool2"],
        "deniedTools": ["delete", "drop"]
      }
    }
  }
}
```

### 目录限制

```json
{
  "filesystem": {
    "env": {
      "allowedDirectories": [
        "/project/src",
        "/project/tests"
      ]
    }
  }
}
```

### Token 控制

```json
{
  "github": {
    "env": {
      "GITHUB_TOKEN": "只读 token"
    }
  }
}
```

## MCP 故障排除

### Server 不启动

```bash
# 检查 Node.js 版本
node --version

# 查看 Server 日志
DEBUG=mcp* npx your-mcp-server
```

### 工具不可用

```bash
# 重启 Claude Code
claude

# 检查 MCP 配置
cat ~/.claude/mcp.json
```

### 权限错误

检查配置文件中的权限设置，确保 Token 有足够权限。

## MCP 生态资源

### 官方 MCP Servers

- [@anthropic-ai/mcp-server-filesystem](https://github.com/anthropics/mcp-server-filesystem)
- [@anthropic-ai/mcp-server-github](https://github.com/anthropics/mcp-server-github)
- [@modelcontextprotocol/server-postgres](https://github.com/modelcontextprotocol/server-postgres)

### 社区 MCP Servers

- [Awesome MCP Servers](https://github.com/chatmcp/awesome-mcp-servers)
- [MCP Hub](https://mcp.sh)

## 最佳实践

### 1. 最小权限原则

```
✅ 只启用需要的 MCP Server
✅ 使用只读 Token
❌ 启用所有功能
```

### 2. 环境变量管理

```
✅ 使用 .env 文件
❌ 硬编码敏感信息
```

### 3. 错误处理

```typescript
try {
  const result = await performAction()
  return { success: true, data: result }
} catch (error) {
  return {
    success: false,
    error: error.message
  }
}
```

### 4. 日志记录

```typescript
console.error(`[${new Date().toISOString()}] Tool called: ${name}`)
```

::: tip 进阶使用
MCP 的强大之处在于可以连接任何外部系统。查看官方文档和社区资源，发现更多有用的 MCP Server。
:::
