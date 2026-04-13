# 快速入门

本指南帮助你在 10 分钟内完成 Claude Code 的安装与配置，理解核心工作流，并开始高效使用。

## 安装

### 系统要求

- **Node.js**：推荐 Node.js 20+（Claude Code 本身由 Node.js 驱动）
- **npm / pnpm / yarn / bun**：任意包管理器
- **Anthropic API Key**：从 [console.anthropic.com](https://console.anthropic.com) 获取，或 Claude Pro/Max 订阅

### 推荐安装方式：npm 全局安装

```bash
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

### 安装原生二进制（可选）

Claude Code 也提供独立的原生二进制，安装后运行不依赖 Node.js：

```bash
# 安装最新稳定版
claude install

# 安装特定版本
claude install stable
claude install latest
claude install 2.1.100
```

### 平台特定安装

#### macOS

```bash
# 如果已通过 npm 安装，可直接使用
claude

# 独立安装（下载原生二进制）
claude install
```

#### Linux

```bash
# 通过 npm 安装
npm install -g @anthropic-ai/claude-code

# 独立安装
claude install
```

#### Windows

```bash
# 通过 npm 安装
npm install -g @anthropic-ai/claude-code

# 通过 Scoop 安装独立版本
scoop install claude-code

# 或通过 winget
winget install Anthropic.ClaudeCode
```

> **注意**：Windows 原生二进制可能需要 WSL 环境以获得完整功能。

### 验证安装

```bash
# 查看版本
claude --version
# 输出示例：2.1.101 (Claude Code)

# 快速测试
claude -p "Hello, Claude Code"
```

## 身份验证

Claude Code 需要连接到 Anthropic API。首次使用时会引导你完成身份验证：

```bash
claude
```

系统会引导你：
1. 登录 Anthropic 账号或输入 API Key
2. API Key 从 [console.anthropic.com/settings/api-keys](https://console.anthropic.com/settings/api-keys) 创建
3. 完成认证，开始使用

## 核心工作流

Claude Code 的核心是**对话式编程**——你描述需求，它执行操作。

### 第一个任务

```bash
# 在项目目录启动
cd /path/to/your/project
claude
```

在交互式会话中输入：

```
创建一个 utils/formatDate.ts 文件，包含一个函数 formatDate(date: Date): string，返回 YYYY-MM-DD 格式。
```

Claude Code 会：
1. 分析当前目录结构
2. 创建 `utils/` 目录（如不存在）
3. 写入 `utils/formatDate.ts` 文件
4. 报告完成

### 典型会话流程

```
1. 启动:   claude
2. 描述:   "添加用户认证 API"
3. 审查:   Claude 生成代码，你可以要求修改
4. 测试:   "运行 npm test 检查是否通过"
5. 提交:   "用 /commit 提交这些修改"
6. 退出:   /exit
```

## 完整 CLI 参考

Claude Code 提供丰富的命令行选项，分为**全局选项**和**子命令**。

### 子命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `claude` | 启动交互式会话 | `claude` |
| `claude -p "prompt"` | 单次执行（非交互模式） | `claude -p "解释 main.ts"` |
| `claude agents` | 列出所有配置的 Agent | `claude agents` |
| `claude mcp` | 管理 MCP 服务器 | `claude mcp list` |
| `claude auth` | 管理身份验证 | `claude auth status` |
| `claude doctor` | 健康检查 | `claude doctor` |
| `claude install [target]` | 安装/更新原生二进制 | `claude install stable` |
| `claude update` / `claude upgrade` | 检查并安装更新 | `claude update` |
| `claude plugin` / `claude plugins` | 管理插件 | `claude plugins list` |
| `claude setup-token` | 设置长生命期认证 Token | `claude setup-token` |

### 全局选项（常用）

#### 执行控制

| 选项 | 说明 | 示例 |
|------|------|------|
| `-p, --print` | 单次执行后退出（无交互） | `claude -p "解释这段代码"` |
| `-c, --continue` | 继续最近一次会话 | `claude -c` |
| `-r, --resume [session]` | 恢复指定会话 | `claude -r auth-feature` |
| `-n, --name <name>` | 为会话设置显示名称 | `claude -n "用户认证"` |
| `--session-id <uuid>` | 使用指定 UUID 的会话 | `claude --session-id <uuid>` |
| `--fork-session` | 恢复时创建新会话 ID（不覆盖原会话） | `claude --resume --fork-session` |
| `--from-pr [value]` | 从 PR 恢复会话（可传入 PR 编号或 URL） | `claude --from-pr 123` |
| `--no-session-persistence` | 不保存会话（仅配合 `--print`） | `claude -p --no-session-persistence` |

#### 模型与输出

| 选项 | 说明 | 示例 |
|------|------|------|
| `--model <model>` | 指定模型 | `claude --model sonnet` |
| `--fallback-model <model>` | 主模型超载时自动切换 | `claude --print --fallback-model haiku` |
| `--effort <level>` | 任务投入程度（low/medium/high/max） | `claude --effort high` |
| `--output-format <format>` | 输出格式（text/json/stream-json） | `claude -p --output-format json` |
| `--json-schema <schema>` | 结构化输出验证 | `claude -p --json-schema '{"type":"object"}'` |
| `--input-format <format>` | 输入格式（text/stream-json） | `claude --input-format stream-json` |
| `--max-budget-usd <amount>` | API 调用最大花费（仅 `--print`） | `claude -p --max-budget-usd 0.10` |

#### 上下文与文件

| 选项 | 说明 | 示例 |
|------|------|------|
| `--add-dir <dirs...>` | 额外允许工具访问的目录 | `claude --add-dir /tmp/shared` |
| `--file <specs...>` | 启动时下载文件资源 | `claude --file file_abc:doc.txt` |
| `--system-prompt <prompt>` | 自定义系统提示词 | `claude --system-prompt "你是 Rust 专家"` |
| `--append-system-prompt <prompt>` | 追加到默认系统提示词 | `claude --append-system-prompt "使用中文回复"` |
| `--exclude-dynamic-system-prompt-sections` | 将动态系统段落移入首条用户消息 | 配合 prompt caching 使用 |
| `--setting-sources <sources>` | 指定加载哪些配置源（user/project/local） | `claude --setting-sources user,project` |
| `--settings <file-or-json>` | 加载额外设置 | `claude --settings ./local-settings.json` |

#### 权限与安全

| 选项 | 说明 | 示例 |
|------|------|------|
| `--permission-mode <mode>` | 权限模式 | 见下方说明 |
| `--dangerously-skip-permissions` | 跳过所有权限检查（危险） | `claude --dangerously-skip-permissions` |
| `--allow-dangerously-skip-permissions` | 允许将"跳过权限"作为可选项 | — |
| `--allowedTools <tools...>` | 白名单工具列表 | `claude --allowedTools "Bash,Edit,Read"` |
| `--disallowedTools <tools...>` | 黑名单工具列表 | `claude --disallowedTools "Bash,Write"` |
| `--bare` | 极简模式（跳过 hooks、LSP、插件等） | `claude --bare` |

**`--permission-mode` 选项**：
- `default` — 默认行为，危险操作需确认
- `auto` — 自动接受安全操作，危险操作需确认
- `acceptEdits` — 自动接受所有编辑
- `bypassPermissions` — 跳过所有权限检查
- `dontAsk` — 不询问任何权限
- `plan` — 仅计划模式，不执行实际操作

#### Agent 与 MCP

| 选项 | 说明 | 示例 |
|------|------|------|
| `--agent <name>` | 指定当前会话使用的 Agent | `claude --agent review` |
| `--agents <json>` | 以 JSON 格式定义自定义 Agent | 见 Agent 章节 |
| `--mcp-config <configs...>` | 加载 MCP 服务器配置 | `claude --mcp-config ./mcp.json` |
| `--strict-mcp-config` | 仅使用 `--mcp-config` 的 MCP 配置 | — |
| `--plugin-dir <path>` | 加载插件目录（可多次指定） | `claude --plugin-dir ./plugins` |

#### 开发与调试

| 选项 | 说明 | 示例 |
|------|------|------|
| `-d, --debug [filter]` | 启用调试模式 | `claude -d api,hooks` |
| `--debug-file <path>` | 将调试日志写入指定文件 | `claude --debug-file ./debug.log` |
| `--verbose` | 覆盖 verbose 模式设置 | `claude --verbose` |
| `--disable-slash-commands` | 禁用所有 slash 命令 | `claude --disable-slash-commands` |
| `--betas <betas...>` | 添加 beta 头部（仅 API Key 用户） | `claude --betas my-beta` |

#### 其他

| 选项 | 说明 | 示例 |
|------|------|------|
| `--ide` | 启动时自动连接 IDE（如只有一个可用 IDE） | `claude --ide` |
| `--chrome` / `--no-chrome` | 启用/禁用 Chrome 集成 | `claude --no-chrome` |
| `--include-hook-events` | 在输出流中包含 hook 事件 | 配合 `--output-format=stream-json` |
| `--include-partial-messages` | 包含部分消息块 | 配合 `--print` 和 `--output-format=stream-json` |
| `--replay-user-messages` | 将用户消息回显到 stdout | 配合流式输入/输出 |
| `--remote-control-session-name-prefix <prefix>` | 远程控制会话名称前缀 | — |
| `-w, --worktree [name]` | 为此会话创建新的 git worktree | `claude -w feature-auth` |
| `--tmux` | 创建 tmux 会话（需配合 `--worktree`） | `claude -w auth --tmux` |

## 配置文件

### 项目级配置（CLAUDE.md）

在项目根目录创建 `CLAUDE.md`，Claude Code 会自动加载：

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

配置文件位于 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-..."
  },
  "permissions": {
    "allow": []
  },
  "model": "sonnet",
  "effortLevel": "medium"
}
```

**主要配置项**：

| 配置项 | 说明 | 可选值 |
|--------|------|--------|
| `model` | 默认模型 | `sonnet`, `opus`, `haiku` 或完整模型名 |
| `effortLevel` | 默认任务投入程度 | `low`, `medium`, `high`, `max` |
| `permissions.allow` | 自动允许的命令白名单 | 命令路径数组 |
| `env.*` | 环境变量 | API Key 等 |

### 项目级 MCP 配置（.mcp.json）

在项目根目录创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
    }
  }
}
```

## 高效使用技巧

### 1. 明确指定范围

```
✅ "修改 src/auth/login.ts 中的 validateEmail 函数"
❌ "修复登录 bug"
```

### 2. 分步骤进行

```
✅ 第一步："分析当前数据库 schema"
✅ 第二步："基于分析结果，设计 users 表的迁移脚本"
```

### 3. 利用上下文

Claude Code 记住整个会话，可以引用之前的内容：

```
"修改你刚才生成的函数，添加参数校验"
"解释上一段代码中的类型定义"
```

### 4. 使用 Slash 命令快速切换

| 场景 | 命令 |
|------|------|
| 开始全新任务 | `/clear` |
| 里程碑完成 | `/compact` |
| 查看可用命令 | `/help` |
| 提交更改 | `/commit` |
| 计划任务 | `/plan` |
| 代码简化 | `/simplify` |
| 网络搜索 | `/web-search` |

## 下一步

- **[基础使用](/guide/basic-usage)** — 深入交互模式、文件操作、Git 集成
- **[核心概念](/guide/concepts)** — 理解架构、上下文、工具调用
- **[Agent 系统](/guide/agents)** — 自定义 Agent 实现专业化工作流
- **[MCP 集成](/guide/mcp)** — 连接外部工具和服务
- **[Slash 命令](/guide/slash-commands)** — 完整命令参考

## 常见问题

### Q: 如何切换模型？

会话中输入 `/model sonnet` 或使用 `--model` 选项：

```bash
claude --model opus  # 启动时指定
/model sonnet        # 会话中切换
```

### Q: 如何降低使用成本？

1. 默认使用 Sonnet（性价比最高）
2. 简单任务使用 Haiku：`--model haiku`
3. 设置预算上限：`--max-budget-usd 0.05`
4. 定期 `/compact` 压缩上下文
5. 禁用不需要的 MCP 服务器

### Q: 如何让 Claude 记住项目特定信息？

在项目根目录创建 `CLAUDE.md` 文件，Claude Code 自动加载。

### Q: 会话历史在哪里？如何恢复？

```bash
# 继续最近一次会话
claude -c

# 恢复指定会话（交互选择）
claude -r

# 通过名称恢复
claude -r auth-feature
```

### Q: 首次使用 Claude Code 没有任何反应？

1. 确保已认证：`claude auth status`
2. 检查 API Key：`~/.claude/settings.json` 中的 `env.ANTHROPIC_API_KEY`
3. 运行诊断：`claude doctor`

### Q: Claude Code 执行了危险操作怎么办？

使用 `--permission-mode dontAsk` 或 `--dangerously-skip-permissions` 谨慎使用。对于危险命令（如 `rm -rf`），Claude Code 默认会要求确认。

::: tip
首次使用建议花 15 分钟阅读[核心概念](/guide/concepts)，理解上下文管理和工具调用机制，这会让你后续使用效率翻倍。
:::
