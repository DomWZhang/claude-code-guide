# 快速入门

本指南帮助你在 10 分钟内安装并配置 Claude Code，理解其核心工作流，并开始高效使用。

## 安装

### 系统要求

- Node.js 18+ 或 20+
- npm / pnpm / yarn / bun（任意包管理器）
- Anthropic API Key（或 Claude Pro 订阅）

### macOS

```bash
# Homebrew（推荐）
brew install claude-cli

# 验证安装
claude --version
```

### Linux

```bash
# x86_64
curl -fsSL https://downloads.anthropic.com/claude-code/latest/linux-x86_64 -o claude-code
chmod +x claude-code
sudo mv claude-code /usr/local/bin/

# ARM64
curl -fsSL https://downloads.anthropic.com/claude-code/latest/linux-aarch64 -o claude-code
chmod +x claude-code
sudo mv claude-code /usr/local/bin/
```

### Windows

```powershell
# Scoop
scoop install claude-code

# 或使用 winget
winget install Anthropic.ClaudeCode
```

## 首次配置

### 身份验证

```bash
claude --init
```

系统会引导你：
1. 登录 Anthropic 账号
2. 输入 API Key（从 [console.anthropic.com](https://console.anthropic.com) 获取）
3. 选择默认模型（推荐 Sonnet）

### 验证配置

```bash
# 查看版本
claude --version

# 测试 API 连接
claude -p "Hello, world!"
```

## 核心工作流

Claude Code 的核心是**对话式编程**。你描述需求，它执行操作。

### 第一个任务

```bash
cd /path/to/your/project
claude
```

输入：
```
创建一个 utils/formatDate.ts 文件，包含一个函数 formatDate(date: Date): string，返回 YYYY-MM-DD 格式。
```

Claude Code 会：
1. 读取当前目录结构
2. 创建 `utils/` 目录（如不存在）
3. 写入 `formatDate.ts` 文件
4. 报告完成

### 典型会话流程

```
1. 启动: claude
2. 描述需求: "添加用户认证 API"
3. 审查代码: Claude 生成代码，你可以要求修改
4. 测试: "运行 npm test 检查是否通过"
5. 提交: "git commit -m 'feat: add auth'"
6. 退出: /exit
```

## 关键命令速查

| 命令 | 功能 |
|------|------|
| `claude` | 启动交互会话 |
| `claude -p "prompt"` | 单次执行（非交互） |
| `/help` | 查看帮助 |
| `/model sonnet` | 切换到 Sonnet（省钱） |
| `/model opus` | 切换到 Opus（复杂任务） |
| `/clear` | 清空会话历史 |
| `/compact` | 手动压缩上下文 |
| `/cost` | 查看当前会话费用 |
| `/exit` | 退出 |

## 配置文件

### 项目级配置（CLAUDE.md）

在项目根目录创建 `CLAUDE.md`：

```markdown
# 项目名称

## 技术栈
- TypeScript 5.x
- React 18
- Tailwind CSS

## 代码规范
- 使用函数组件
- 使用命名导出
- 组件文件最多 200 行

## 常用命令
- 开发: npm run dev
- 构建: npm run build
- 测试: npm test
```

### 用户级配置（settings.json）

`~/.claude/settings.json`：

```json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
  }
}
```

## 高效技巧

### 1. 明确指定范围

```
✅ "修改 src/auth/login.ts 中的 validateEmail 函数"
❌ "修复登录 bug"
```

### 2. 分步骤进行

```
✅ 先问："分析当前数据库 schema"
   再问："基于分析结果，设计 users 表的迁移脚本"
```

### 3. 利用上下文

Claude Code 记住整个会话，可以引用之前的内容：
- "修改你刚才生成的函数，添加参数校验"
- "解释上一段代码中的类型定义"

### 4. 使用 Slash 命令快速切换

| 场景 | 命令 |
|------|------|
| 开始新任务 | `/clear` |
| 里程碑完成 | `/compact` |
| 检查花费 | `/cost` |
| 查看可用命令 | `/help` |

## 下一步

- **[基础使用](/guide/basic-usage)** — 深入交互模式、文件操作、Git 集成
- **[核心概念](/guide/concepts)** — 理解架构、上下文、工具调用
- **[生态工具](/guide/ecosystem/everything-claude-code)** — Everything Claude Code 等扩展
- **[性能优化](/guide/advanced/performance)** — 降低成本、提高效率

## 常见问题

### Q: 如何切换模型？

会话中输入 `/model sonnet` 或 `/model opus`。

### Q: 如何降低使用成本？

1. 默认使用 Sonnet
2. 设置 `MAX_THINKING_TOKENS=10000`
3. 定期 `/compact`
4. 禁用不用的 MCP

### Q: 如何让 Claude 记住项目特定信息？

在项目根目录创建 `CLAUDE.md` 文件，Claude 自动加载。

### Q: 会话历史在哪里？

使用 `/sessions` 查看和管理。

::: tip
首次使用建议花 15 分钟阅读[核心概念](/guide/concepts)和[性能优化](/guide/advanced/performance)，这会让你后续使用效率翻倍。
:::
