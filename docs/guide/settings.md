# 配置文件

Claude Code 的配置文件用于自定义其行为和设置。

## 配置文件类型

```
┌─────────────────────────────────────────────┐
│            ~/.claude/settings.json           │
│            (全局用户设置)                     │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│            ~/.claude/projects/               │
│            (项目特定设置)                     │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│            <project>/CLAUDE.md               │
│            (项目级配置和指令)                 │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│            <project>/.claude/                │
│            (项目级配置文件)                   │
└─────────────────────────────────────────────┘
```

## 全局设置 (~/.claude/settings.json)

### 基本结构

```json
{
  "version": "1.0",
  "model": "claude-opus-4-6",

  "appearance": {
    "theme": "dark",
    "fontSize": 14,
    "fontFamily": "Menlo"
  },

  "behavior": {
    "autoScroll": true,
    "soundEffects": false,
    "notifications": true
  }
}
```

### 完整配置示例

```json
{
  "version": "1.0",

  "//": "模型配置",
  "model": "claude-opus-4-6",
  "maxTokens": 8192,
  "temperature": 0.7,

  "//": "输出配置",
  "output": {
    "markdown": true,
    "codeHighlight": true,
    "showThinking": false
  },

  "//": "行为配置",
  "behavior": {
    "autoConfirm": false,
    "verboseErrors": true,
    "explainDecisions": true,
    "showToolCalls": true
  },

  "//": "工具配置",
  "tools": {
    "Bash": {
      "timeout": 300,
      "allowedCommands": null
    },
    "Read": {
      "showLineNumbers": true
    },
    "Write": {
      "autoBackup": true
    }
  },

  "//": "记忆配置",
  "memory": {
    "enabled": true,
    "autoSave": true,
    "maxSize": "100MB"
  },

  "//": "Hook 配置",
  "hooks": {
    "enabled": true,
    "preAction": [],
    "postAction": []
  },

  "//": "快捷键",
  "shortcuts": {
    "newSession": "ctrl+n",
    "clearScreen": "ctrl+l",
    "exit": "ctrl+d"
  }
}
```

## 项目配置 (CLAUDE.md)

### 基础结构

```markdown
# 项目名称

## 项目描述
简要描述项目

## 技术栈
- 技术1
- 技术2

---

[default]

# 默认 Agent 配置
...

---

[specialist:name]

# 专门 Agent 配置
...
```

### 完整示例

```markdown
# ECommerce Platform

## 项目描述
一个现代化的电商平台，提供用户购物、支付、订单管理等功能。

## 技术栈
- 前端: React 18, TypeScript, Tailwind CSS
- 后端: Node.js, Express, PostgreSQL
- 部署: Docker, AWS

## 项目结构
```
src/
├── client/          # 前端代码
├── server/          # 后端代码
├── shared/          # 共享代码
└── infra/           # 基础设施
```

---

[default]

# 默认规则

## 代码规范
- TypeScript 严格模式
- 2 空格缩进
- 行长度 100 字符

## Git 规范
- 分支命名: feature/XXX, fix/XXX
- Commit 格式: type(scope): message

## 组件规范
- 使用函数组件
- 组件文件最多 200 行
- 提取可复用逻辑到 Hooks

---

[specialist:frontend]

## 前端规则
- 遵循 React 最佳实践
- 使用 CSS Modules
- 组件需要 PropTypes

---

[specialist:backend]

## 后端规则
- RESTful API 设计
- 统一错误处理
- 参数验证

---

[specialist:reviewer]

## 审查规则
- 检查安全性
- 检查性能
- 检查可测试性
```

## .claude 目录结构

```
.claude/
├── settings.json       # 项目设置
├── memory/             # 记忆文件
├── hooks/              # Hook 脚本
├── commands/           # 自定义命令
└── logs/               # 日志文件
```

## settings.json 详细配置

### 模型配置

```json
{
  "model": "claude-opus-4-6",
  "model": "claude-sonnet-4-6",
  "model": "claude-haiku-4-5-20251001",

  "maxTokens": 8192,

  "temperature": 0.7,

  "topP": 0.9,

  "stopSequences": ["```", "---"]
}
```

### 工具配置

```json
{
  "tools": {
    "Read": {
      "enabled": true,
      "maxFileSize": "10MB",
      "encoding": "utf-8"
    },

    "Write": {
      "enabled": true,
      "autoBackup": true,
      "backupDir": ".claude/backups",
      "createParents": true
    },

    "Edit": {
      "enabled": true,
      "requireConfirmation": false,
      "maxChanges": 100
    },

    "Bash": {
      "enabled": true,
      "timeout": 300,
      "workingDirectory": ".",
      "shell": "/bin/zsh",
      "allowedCommands": [
        "npm install",
        "npm test",
        "git status"
      ],
      "deniedCommands": [
        "rm -rf /",
        "dd if=*",
        ":(){:|:&};:"
      ]
    },

    "Glob": {
      "enabled": true,
      "ignore": ["node_modules", ".git", "dist"]
    },

    "Grep": {
      "enabled": true,
      "caseSensitive": false,
      "maxResults": 1000
    }
  }
}
```

### 安全配置

```json
{
  "security": {
    "allowedPaths": ["/Users/april/projects", "/tmp"],
    "deniedPaths": ["/System", "/Users/april/.ssh"],
    "dangerousCommands": {
      "requireConfirmation": ["rm", "dd", "mkfs"],
      "allowInDangerousMode": false
    },
    "rateLimit": {
      "enabled": true,
      "maxRequests": 100,
      "windowMs": 60000
    }
  }
}
```

### API 配置

```json
{
  "api": {
    "provider": "anthropic",
    "apiKey": "${ANTHROPIC_API_KEY}",
    "baseUrl": "https://api.anthropic.com",
    "version": "v1",
    "timeout": 60000,
    "retries": 3
  }
}
```

### 代理配置

```json
{
  "proxy": {
    "enabled": false,
    "http": "http://proxy.example.com:8080",
    "https": "https://proxy.example.com:8080",
    "noProxy": ["localhost", "127.0.0.1"]
  }
}
```

### 日志配置

```json
{
  "logging": {
    "enabled": true,
    "level": "info",
    "directory": ".claude/logs",
    "maxFileSize": "10MB",
    "maxFiles": 5,
    "includeTimestamps": true,
    "categories": {
      "tool_calls": true,
      "errors": true,
      "api_requests": false,
      "performance": true
    }
  }
}
```

### 上下文配置

```json
{
  "context": {
    "maxTokens": 1000000,
    "compressionThreshold": 0.8,
    "priorityFiles": [
      "CLAUDE.md",
      "package.json",
      "tsconfig.json"
    ],
    "excludePatterns": [
      "**/*.min.js",
      "**/*.map",
      "**/node_modules/**"
    ]
  }
}
```

## 环境变量

### 配置文件中的环境变量

```json
{
  "apiKey": "${ANTHROPIC_API_KEY}",
  "databaseUrl": "${DATABASE_URL}",
  "githubToken": "${GITHUB_TOKEN}"
}
```

### .env 文件

```
ANTHROPIC_API_KEY=sk-ant-xxxx
GITHUB_TOKEN=ghp_xxxx
DATABASE_URL=postgresql://localhost:5432/mydb
```

::: warning 安全
不要将包含真实 API Key 的配置文件提交到 Git！
:::

## 配置继承

```
全局配置 (~/.claude/settings.json)
    ↓ 覆盖
项目配置 (<project>/.claude/settings.json)
    ↓ 覆盖
CLAUDE.md 指令
    ↓ 覆盖
命令行参数
```

## 配置验证

验证配置是否正确：

```bash
claude --validate-config
```

## 配置热重载

某些配置更改后需要重启 Claude Code 才能生效：

- `settings.json` 的更改需要重启
- `CLAUDE.md` 的更改通常立即生效
- Hook 脚本的更改通常立即生效

## 常见配置问题

### 1. 配置不生效

```bash
# 检查配置路径
ls ~/.claude/settings.json
ls .claude/settings.json

# 查看配置优先级
claude --debug-config
```

### 2. 权限问题

```bash
# 确保配置文件可读
chmod 644 ~/.claude/settings.json

# 确保目录可访问
chmod 755 ~/.claude
```

### 3. 格式错误

```json
// ✅ 正确的 JSON 格式
{
  "key": "value",
  "array": [1, 2, 3]
}

// ❌ 错误的 JSON 格式
{
  "key": "value",  // 缺少逗号
  "array": [1, 2 3]
}
```

## 配置备份

定期备份配置：

```bash
# 备份配置
cp ~/.claude/settings.json ~/.claude/settings.json.bak
cp -r ~/.claude ~/.claude-backup-$(date +%Y%m%d)
```

::: tip 最佳实践
- 将配置文件纳入版本控制（排除敏感信息）
- 使用环境变量管理密钥
- 定期审查和更新配置
- 为不同项目创建不同配置模板
:::
