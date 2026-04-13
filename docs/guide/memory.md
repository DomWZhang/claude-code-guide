# Memory 系统

Claude Code 的 Memory 系统让你能够跨会话记住项目上下文、用户偏好和重要信息，无需每次都重复说明。

## Memory 概述

Claude Code 的记忆系统分为三层：

```
┌────────────────────────────────────────────────────────────┐
│  Session Memory (会话记忆)                                  │
│  当前会话有效，包含对话历史和工具调用结果                     │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│  Project Memory (项目记忆)                                  │
│  存储在 ~/.claude/projects/<project>/                      │
│  仅在特定项目会话中可用                                     │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│  User Memory (用户记忆)                                    │
│  存储在 ~/.claude/memory/                                  │
│  跨所有项目和会话永久有效                                   │
└────────────────────────────────────────────────────────────┘
```

三层记忆相互补充，确保 Claude 始终拥有完成任务所需的上下文。

## 自动记忆

Claude Code 在以下场景会自动记忆：

| 触发时机 | 记忆内容 | 存储位置 |
|----------|----------|----------|
| 项目首次加载 | 项目结构、技术栈 | Project Memory |
| CLAUDE.md 变更 | 配置更新 | Project Memory |
| 用户纠正 | 偏好、风格偏好 | User Memory |
| 任务完成 | 解决的问题、方案 | Project Memory |
| 习惯性操作 | 常用命令、工作流 | User Memory |

### 自动记忆的内容

Claude 自动记住：
- **项目结构**：目录组织、主要模块
- **技术栈**：框架、库、语言版本
- **代码风格**：命名规范、格式约定
- **工作流偏好**：测试命令、部署方式
- **解决过的问题**：Bug 和修复方案
- **用户偏好**：语言偏好（中文/英文）、响应风格

### 控制自动记忆

通过 `~/.claude/settings.json` 可以调整自动记忆行为：

```json
{
  "autoMemory": {
    "enabled": true,
    "rememberProjectStructure": true,
    "rememberCodeStyle": true,
    "rememberUserPreferences": true
  }
}
```

## 手动记忆

### 记住项目信息

在对话中直接告诉 Claude 需要记住的内容：

```
记住：这个项目使用 pnpm 作为包管理器
```

```
记住：用户偏好中文回复所有内容
```

```
记住：测试文件放在 __tests__ 目录下，命名格式为 *.test.ts
```

```
记住：这个模块的数据库连接配置在 src/config/database.ts
```

### 记住用户偏好

```
记住：我喜欢简洁的代码风格，不要过度注释
```

```
记住：每次修改后主动运行测试验证
```

```
记住：API 响应格式统一为 { success, data, error }
```

### 记忆查询

```
之前记住的项目数据库配置是什么？
```

```
我之前设置的技术栈偏好是什么？
```

```
这个项目的代码风格规范是什么？
```

### 忘记/更新记忆

```
忘记之前的 pnpm 偏好，改用 npm
```

```
更新记忆：这个项目现在使用 yarn 而不是 pnpm
```

## 记忆存储位置

### 项目记忆

每个项目的记忆存储在：

```
~/.claude/projects/<project-path>/
├── memory.json       # 记忆数据（JSON 格式）
├── preferences.json  # 项目偏好
└── history.json     # 项目历史
```

其中 `<project-path>` 是项目目录路径的哈希值。

### 用户记忆

全局用户记忆存储在：

```
~/.claude/memory/
├── user.json         # 用户基本信息
├── expertise.json   # 技术栈偏好
├── patterns.json     # 代码模式偏好
└── habits.json       # 使用习惯
```

### 查看和管理记忆

Claude Code 提供了 `/memory` slash 命令：

```
/memory
```

```
/memory list
```

```
/memory add <内容>
```

```
/memory remove <id>
```

```
/memory clear
```

## CLAUDE.md 中的 Memory

CLAUDE.md 是最可靠的记忆载体，优先级最高：

```markdown
# 我的项目

## 技术栈
- React 18
- TypeScript 5.x
- Node.js 20

## 代码规范
- 函数组件 + 命名导出
- 组件文件最多 200 行
- 使用 CSS Modules

## 常用命令
- npm run dev   # 启动开发服务器
- npm run build # 构建生产版本
- npm test      # 运行测试
```

Claude Code **每次会话都会自动加载 CLAUDE.md**，确保始终遵循项目规范。

## 记忆最佳实践

### 1. 优先使用 CLAUDE.md

对于项目结构和技术规范，放在 CLAUDE.md 中比口头说明更可靠：

```markdown
# CLAUDE.md

## 项目说明
这是一个 Next.js 电商项目

## 技术栈
- Next.js 14 (App Router)
- Prisma ORM
- PostgreSQL

## 规范
- 组件放在 components/ 目录
- API 路由放在 app/api/ 目录
```

### 2. 用自然语言建立记忆

Claude 理解自然语言，无需特殊格式：

```
记住：此项目的 CI/CD 使用 GitHub Actions
记住：部署前必须运行 npm run build && npm run test
记住：数据库迁移使用 npm run db:migrate
```

### 3. 定期更新记忆

```
这次重构后，模块结构变了，记住：
- auth 模块移到了 src/features/auth/
- 用户相关逻辑在 src/entities/user/
```

### 4. 区分项目和用户记忆

| 内容类型 | 存储方式 |
|----------|----------|
| 项目特有的规范 | CLAUDE.md |
| 项目特有的上下文 | 手动记忆（Claude 存储） |
| 个人使用偏好 | 手动记忆（Claude 存储） |
| 技术栈偏好 | 手动记忆（Claude 存储） |

## 常见问题

### Q: 记忆存储在哪里？

- **Project Memory**：`~/.claude/projects/<hash>/`
- **User Memory**：`~/.claude/memory/`
- **Sessions**：`~/.claude/sessions/`
- **File History**：`~/.claude/file-history/`

### Q: 如何清除项目记忆？

```
/memory clear
```

或删除对应目录：

```bash
rm -rf ~/.claude/projects/<project-hash>/
```

### Q: 记忆会影响上下文吗？

会。每次记忆增加上下文负担。建议：
- CLAUDE.md 控制在 5KB 以内
- 手动记忆不要超过 10 条
- 定期 `/compact` 清理冗余

### Q: 不同机器的记忆同步吗？

不自动同步。记忆存储在本地。如需同步，可以使用：
- Git 仓库中的 CLAUDE.md（推荐）
- 云盘同步 `~/.claude/` 目录
- `.mcp.json` 中的 MCP 服务器

### Q: 如何让 Claude 记住 API Key 等敏感信息？

**不要**将敏感信息存储在记忆或 CLAUDE.md 中。使用环境变量：

```bash
export OPENAI_API_KEY=sk-...
```

然后在 Claude 中：

```
记住：API Key 使用环境变量 OPENAI_API_KEY
```
