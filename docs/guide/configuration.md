# 配置指南

深入了解 Claude Code 的各种配置选项和最佳配置实践。

## 配置优先级

Claude Code 的配置按以下优先级加载（从低到高）：

```
1. Claude Code 内置默认值
        ↓
2. ~/.claude/settings.json (全局用户设置)
        ↓
3. <project>/.claude/settings.json (项目设置)
        ↓
4. <project>/CLAUDE.md (项目指令)
        ↓
5. 命令行参数 (最高优先级)
```

## 详细配置说明

### 1. 模型配置

```json
{
  "model": "claude-opus-4-6",
  "temperature": 0.7,
  "maxTokens": 8192,
  "topP": 0.9
}
```

| 参数 | 说明 | 可选值 |
|------|------|--------|
| model | 使用的模型 | claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5-20251001 |
| temperature | 创造性程度 | 0.0-1.0 (默认 0.7) |
| maxTokens | 最大输出 token | 1-8192 |
| topP | 核采样 | 0.0-1.0 |

### 2. 外观配置

```json
{
  "appearance": {
    "theme": "auto",
    "fontSize": 14,
    "fontFamily": "Menlo",
    "lineHeight": 1.6,
    "showLineNumbers": true,
    "syntaxHighlighting": true
  }
}
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| theme | 主题 | auto (跟随系统) |
| fontSize | 字体大小 | 14 |
| fontFamily | 字体 | Menlo |
| lineHeight | 行高 | 1.6 |

### 3. 行为配置

```json
{
  "behavior": {
    "autoConfirm": false,
    "verboseErrors": true,
    "showThinking": true,
    "showToolCalls": true,
    "explainDecisions": false,
    "soundEffects": false,
    "notifications": true,
    "autoScroll": true
  }
}
```

### 4. 工具配置

```json
{
  "tools": {
    "Read": {
      "enabled": true,
      "maxFileSize": "10MB",
      "showLineNumbers": true,
      "defaultLimit": 500
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
      "maxChangesPerSession": 100
    },
    "Bash": {
      "enabled": true,
      "timeout": 300,
      "workingDirectory": ".",
      "shell": "/bin/zsh",
      "allowedCommands": null,
      "deniedCommands": ["rm -rf /", "dd if=*"]
    },
    "Glob": {
      "enabled": true,
      "ignore": ["node_modules", ".git", "dist", "build"]
    },
    "Grep": {
      "enabled": true,
      "caseSensitive": false,
      "maxResults": 1000
    }
  }
}
```

### 5. 上下文配置

```json
{
  "context": {
    "maxTokens": 1000000,
    "compressionThreshold": 0.8,
    "autoCompact": true,
    "priorityFiles": [
      "CLAUDE.md",
      "package.json",
      "tsconfig.json",
      ".gitignore"
    ],
    "excludePatterns": [
      "**/*.min.js",
      "**/node_modules/**",
      "**/*.log",
      "**/.git/**"
    ]
  }
}
```

### 6. MCP 配置

```json
{
  "mcp": {
    "enabled": true,
    "servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@anthropic-ai/mcp-server-filesystem"],
        "env": {
          "allowedDirectories": ["/Users/april/projects"]
        }
      },
      "github": {
        "command": "npx",
        "args": ["-y", "@anthropic-ai/mcp-server-github"],
        "env": {
          "GITHUB_TOKEN": "${GITHUB_TOKEN}"
        }
      }
    }
  }
}
```

### 7. Hooks 配置

```json
{
  "hooks": {
    "enabled": true,
    "timeout": 30,
    "scripts": {
      "pre-action": [],
      "post-action": [],
      "pre-commit": [],
      "post-commit": []
    }
  }
}
```

### 8. 日志配置

```json
{
  "logging": {
    "enabled": true,
    "level": "info",
    "directory": ".claude/logs",
    "maxFileSize": "10MB",
    "maxFiles": 5,
    "categories": {
      "tool_calls": true,
      "errors": true,
      "api_requests": false,
      "performance": true,
      "debug": false
    }
  }
}
```

### 9. 安全配置

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

### 10. API 配置

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

## 环境变量

### 支持的环境变量

| 变量名 | 说明 |
|--------|------|
| ANTHROPIC_API_KEY | Anthropic API 密钥 |
| GITHUB_TOKEN | GitHub 个人访问令牌 |
| HTTP_PROXY | HTTP 代理地址 |
| HTTPS_PROXY | HTTPS 代理地址 |
| NO_PROXY | 不使用代理的地址 |

### 使用环境变量

在配置文件中使用 `${VAR_NAME}` 语法：

```json
{
  "api": {
    "apiKey": "${ANTHROPIC_API_KEY}"
  }
}
```

或在终端中设置：

```bash
# macOS/Linux
export ANTHROPIC_API_KEY="sk-ant-xxxx"

# Windows
set ANTHROPIC_API_KEY=sk-ant-xxxx
```

## 场景化配置

### 1. 开发环境

```json
{
  "behavior": {
    "autoConfirm": false,
    "showToolCalls": true,
    "showThinking": true
  },
  "tools": {
    "Bash": {
      "timeout": 60
    }
  }
}
```

### 2. 生产环境

```json
{
  "behavior": {
    "autoConfirm": false,
    "showToolCalls": false,
    "explainDecisions": true
  },
  "security": {
    "dangerousCommands": {
      "requireConfirmation": ["*"]
    }
  }
}
```

### 3. 快速原型

```json
{
  "behavior": {
    "autoConfirm": true,
    "showToolCalls": false,
    "showThinking": false
  },
  "tools": {
    "Bash": {
      "timeout": 300
    }
  }
}
```

### 4. 严格审查

```json
{
  "behavior": {
    "explainDecisions": true,
    "verboseErrors": true
  },
  "tools": {
    "Edit": {
      "requireConfirmation": true
    },
    "Bash": {
      "requireConfirmation": true
    }
  }
}
```

## 配置验证

### 检查配置

```bash
claude --validate-config
```

### 查看加载的配置

```bash
claude --show-config
```

### 测试配置更改

```bash
# 临时使用配置
claude --config /path/to/config.json
```

## 配置迁移

### 从旧版本迁移

如果使用旧版本的 Claude Code，配置格式可能需要更新：

```json
// 旧格式
{
  "model": "claude-opus-4-6",
  "apiKey": "..."
}

// 新格式
{
  "model": "claude-opus-4-6",
  "api": {
    "apiKey": "${ANTHROPIC_API_KEY}"
  }
}
```

## 常见配置错误

### 1. JSON 格式错误

```json
// ❌ 错误
{
  "key": "value"
  "key2": "value2"
}

// ✅ 正确
{
  "key": "value",
  "key2": "value2"
}
```

### 2. 路径格式错误

```json
// ❌ Windows 路径
"allowedPaths": ["C:\\Users\\name\\projects"]

// ✅ 跨平台路径
"allowedPaths": ["/Users/name/projects", "C:\\Users\\name\\projects"]

// ✅ 使用 home 目录
"allowedPaths": ["~/projects"]
```

### 3. 环境变量未定义

```json
// ❌ 使用不存在的变量
"apiKey": "${NONEXISTENT_VAR}"

// ✅ 使用存在的变量
"apiKey": "${ANTHROPIC_API_KEY}"
```

## 配置备份与恢复

### 备份

```bash
# 备份所有配置
cp -r ~/.claude ~/.claude-backup-$(date +%Y%m%d)

# 备份特定配置
cp ~/.claude/settings.json ~/.claude/settings.json.bak
```

### 恢复

```bash
# 恢复所有配置
cp -r ~/.claude-backup-20240115/* ~/.claude/

# 恢复特定配置
cp ~/.claude/settings.json.bak ~/.claude/settings.json
```

## 配置模板

### 最小配置

```json
{
  "model": "claude-opus-4-6",
  "apiKey": "${ANTHROPIC_API_KEY}"
}
```

### 完整配置

参考前文的完整配置示例。

### 项目配置

```json
{
  "project": {
    "name": "my-project",
    "type": "react-typescript"
  },
  "tools": {
    "Bash": {
      "allowedCommands": ["npm *", "git *", "pnpm *"]
    }
  },
  "context": {
    "priorityFiles": ["CLAUDE.md", "package.json", "tsconfig.json"]
  }
}
```

## 调试配置

### 启用调试模式

```bash
DEBUG=* claude
```

### 查看配置加载

```bash
DEBUG=config claude
```

### 查看工具调用

```bash
DEBUG=tools claude
```

## 获取帮助

如需更多配置选项：

```bash
claude --help
claude --help-config
```

::: tip 配置管理
建议使用版本控制管理配置文件（排除敏感信息），并使用环境变量管理密钥。这样可以在多台设备间同步配置。
:::
