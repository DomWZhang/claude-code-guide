# Slash Commands

Slash Commands 是 Claude Code 中以 `/` 开头的快捷命令，用于触发特定功能。它们是交互式编程中最常用的工具之一。

## 内置 Slash Commands

### /help — 帮助信息

显示内置命令列表和快速参考。

```
/help
```

这是最基础的探索命令，可以快速查看所有可用选项。

### /exit 或 /bye — 退出

退出当前 Claude Code 会话。

```
/exit
```
```
/bye
```

两者效果相同，`/bye` 是 `/exit` 的别名。

### /new — 新会话

清除当前上下文，开启一个全新的会话。适用于：
- 任务已完成，想开始下一个
- 当前上下文混乱，需要重新开始
- 误操作导致状态异常

```
/new
```

::: warning 谨慎使用
执行 `/new` 后，当前会话的所有上下文（包括记忆）都会丢失。如果有重要信息，先用 `/memory` 保存或复制到外部。
:::

### /clear — 清屏

清除终端屏幕内容，不影响会话上下文。这只是视觉上的清理，实际的对话历史和上下文保持不变。

```
/clear
```

适用于：
- 终端输出过多，想重新开始阅读
- 需要专注当前任务
- 不想滚动查看历史输出

### /compact — 上下文压缩

手动触发上下文压缩，释放已消耗的 Token 空间。这是 Claude Code 最实用的命令之一。

```
/compact
```

**自动触发**：Claude Code 在上下文使用达到约 95% 时会自动触发压缩。

**手动触发场景**：
- 完成了阶段性工作（如调研完成、调试完成）
- 想在继续新任务前保持清醒的上下文
- 上下文已超过 60% 但还有大量工作要做

**压缩原理**：Claude Code 会分析当前上下文，提取最重要的信息（项目结构、最近修改、待办事项），然后重新构建一个更紧凑的上下文窗口。

**配合 Hook 使用**：[Everything Claude Code](/guide/ecosystem/everything-claude-code) 的 `suggest-compact` 钩子会在逻辑断点主动提示压缩时机。

### /plan — 进入计划模式

进入**计划模式**，在正式实现前让 Claude 先制定详细计划，等待用户确认后再执行。这是安全且高效的工作方式。

```
/plan
```

**典型工作流**：

```
用户: /plan 实现用户认证功能

Claude: (进入计划模式，分析需求后输出)
## 实现计划：用户认证功能

### 1. 数据库层
- 创建 users 表（id, email, password_hash, created_at, updated_at）
- 添加索引：email (唯一), created_at

### 2. API 层
- POST /api/auth/register — 用户注册
- POST /api/auth/login — 用户登录
- POST /api/auth/logout — 登出
- GET /api/auth/me — 获取当前用户

### 3. 安全措施
- 密码 bcrypt 哈希（cost=12）
- JWT Token（1 天有效期）
- 登录限流（5 次/15 分钟）

### 4. 测试覆盖
- 单元测试：密码哈希、JWT 生成/验证
- 集成测试：注册→登录→访问受保护资源

用户确认后，Claude 会逐项执行。
```

**适用场景**：
- 实现新功能前
- 大规模重构前
- 不确定实现方案时
- 需要评审技术方案时

### /test — 生成测试

为指定的代码文件或函数生成测试用例。

```
/test src/utils/format.ts
```

或

```
/test validateEmail
```

Claude 会分析代码逻辑，生成对应的测试用例。如果项目使用测试框架（如 Jest、Vitest、pytest），Claude 会使用对应框架的语法。

### /simplify — 代码审查

对修改的代码进行质量审查，找出可优化的地方。这是一个快速代码审查工具。

```
/simplify
```

Claude 会分析最近的修改（通过 Git diff），从以下维度给出建议：
- **可读性**：命名、注释、结构
- **性能**：算法复杂度、重复计算
- **安全性**：注入风险、敏感信息
- **最佳实践**：语言/框架惯例、设计模式

### /commit — Git 提交

生成符合规范的 Git 提交信息。

```
/commit
```

Claude 会分析当前的 Git 变更（`git diff --staged`），生成语义化的提交信息：

```
feat(auth): add JWT-based authentication

- POST /api/auth/register endpoint
- POST /api/auth/login with bcrypt verify
- JWT middleware for protected routes
- Login rate limiting (5 attempts per 15 min)
```

你可以在此基础上修改，也可以直接接受。

### /review-pr — 审查 Pull Request

审查一个 GitHub Pull Request。

```
/review-pr 123
```
或
```
/review-pr https://github.com/owner/repo/pull/123
```

Claude 会拉取 PR 内容，从以下维度审查：
- 代码逻辑正确性
- 潜在 bug 和边缘情况
- 安全漏洞
- 测试覆盖是否充分
- 是否符合项目规范

### /web-search — 网络搜索

在网络上搜索信息。Claude Code 集成了搜索能力，可以获取最新文档、博客、讨论等。

```
/web-search latest Claude Code features 2025
```

```
/web-search react 19 new features
```

结果会直接用于回答你的问题或补充上下文。

### /loop — 循环执行

设置一个周期性任务，让 Claude 持续执行特定操作。

```
/loop 5m /web-search "anthropic news"
```

参数：`/loop <间隔> <要执行的命令>`

**用途**：
- 持续监控部署状态
- 轮询构建进度
- 定期检查外部 API 状态

### /fast — 快速模式

启用快速模式，使用更快的模型（Haiku），跳过详细思考过程。

```
/fast
```

适用于：
- 简单重复性任务
- 需要快速响应的场景
- `/new` 后想快速开始

### /memory — 记忆管理

查看和管理 Claude 的持久化记忆。

```
/memory
/memory list
/memory add 完成项目初始化，包括目录结构和基础配置文件
/memory remove <记忆ID>
```

记忆系统让 Claude 可以跨会话记住项目特定的信息。

### /lsp — LSP 诊断

获取当前文件的语言服务器（LSP）诊断信息。

```
/lsp
```

显示当前文件的 TypeScript 错误、警告等信息。

## 自定义 Slash Commands

Claude Code 支持两种方式创建自定义命令：

### 方式 1：Skills 系统（推荐）

每个 Skill 对应一个 `.md` 文件在 `~/.claude/skills/` 目录中。调用时使用 `/<skill-name>` 即可。

```
/<skill-name>
/<skill-name> <参数>
```

**创建步骤**：

1. 创建 Skill 文件：
```markdown
# Skill: tdd-workflow

这是一个 TDD（测试驱动开发）工作流。

## 触发条件
当用户要求进行 TDD 开发时调用此技能。

## 工作流程
1. **红灯（Red）**：先写一个会失败的测试
2. **绿灯（Green）**：写最少量代码让测试通过
3. **重构（Refactor）**：优化代码，同时保持测试通过

## 行为规范
- 严格遵循：写测试 → 运行测试（失败）→ 写代码 → 运行测试（通过）→ 重构
- 测试文件放在 __tests__/ 或 tests/ 目录
- 使用 describe/it 或 test 语法（根据项目现有测试框架）
- 覆盖率目标：> 80%

## 输出格式
完成每个 TDD 循环后，报告：
- 测试数量
- 通过/失败状态
- 覆盖率变化
```

2. 调用 Skill：
```
/tdd-workflow 实现一个字符串去重函数
```

**Skill 文件结构**：
- `# Skill: <name>` — 名称
- `## description` — 描述（用于 /help 显示）
- `## triggers` — 触发条件
- `## workflow` — 工作流程
- `## rules` — 行为规范

### 方式 2：外部命令（直接执行）

Claude Code 可以直接执行任何 shell 命令，只需在命令前加上 `/`。

```
/git status
/npm run build
/npx prettier --write src/
```

这不是传统意义上的"自定义命令"，而是直接通过 `/` 前缀触发系统命令。但它大大简化了命令输入。

### 方式 3：CLAUDE.md 中的自定义指令

在项目根目录的 `CLAUDE.md` 文件中定义项目的特定行为：

```markdown
# 我的项目

## 常用任务别名

当用户说以下关键词时，执行对应操作：
- "跑测试" 或 "run tests" → 运行 `npm test`
- "构建" 或 "build" → 运行 `npm run build`
- "检查" 或 "check" → 运行 `npm run lint && npm run type-check`
```

### Everything Claude Code 的命令集

[Everything Claude Code](/guide/ecosystem/everything-claude-code) 提供了大量预置命令：

| 命令 | 功能 |
|------|------|
| `/tdd` | 测试驱动开发全流程 |
| `/code-review` | 完整代码审查 |
| `/build-fix` | 自动修复构建错误 |
| `/e2e` | 生成 Playwright E2E 测试 |
| `/security-scan` | 安全审计 |
| `/refactor-clean` | 死代码清理 |
| `/update-docs` | 同步更新文档 |
| `/multi-plan` | 多 Agent 任务分解 |
| `/multi-execute` | 多 Agent 并行执行 |
| `/strategic-compact` | 战略压缩 |
| `/verify` | 完整验证循环 |

## 常用命令工作流

### 日常开发流程

```
# 1. 开始一天的工作，加载项目上下文
cd ~/project

# 2. 查看状态
claude
> /git status

# 3. 开始新任务，先制定计划
> /plan 实现支付回调接口

# 4. 确认后执行实现
> [Claude 执行...]

# 5. 实现完成后，写测试
> /test src/payment/callback.ts

# 6. 代码审查
> /simplify

# 7. 提交代码
> /commit

# 8. 清理上下文，准备下一个任务
> /compact
```

### Bug 修复流程

```
# 1. 用户报告 bug
> 登录功能在连续登录失败后返回 500

# 2. 制定调查计划
> /plan 调查登录 500 错误

# 3. 执行调查和修复
> [Claude 修复...]

# 4. 验证修复
> /test src/auth/login.test.ts

# 5. 代码审查
> /simplify

# 6. 提交（注明修复）
> /commit
```

### PR 审查流程

```
# 审查团队成员的 PR
> /review-pr 234

# Claude 给出审查意见后，汇总给团队
```

## 命令速查表

| 命令 | 功能 | 使用频率 |
|------|------|---------|
| `/help` | 显示帮助 | 低 |
| `/exit` | 退出会话 | 低 |
| `/new` | 新会话 | 中 |
| `/clear` | 清屏 | 高 |
| `/compact` | 压缩上下文 | 高 |
| `/plan` | 制定计划 | 高 |
| `/simplify` | 代码审查 | 中 |
| `/test` | 生成测试 | 高 |
| `/commit` | Git 提交 | 高 |
| `/review-pr` | PR 审查 | 中 |
| `/web-search` | 网络搜索 | 中 |
| `/loop` | 循环任务 | 低 |
| `/fast` | 快速模式 | 低 |
| `/memory` | 记忆管理 | 中 |
| `/lsp` | LSP 诊断 | 低 |

::: tip 高效使用建议
掌握 `/plan` 和 `/simplify` 是提升效率的关键 — 前者避免走弯路，后者确保代码质量。这两个命令在 Everything Claude Code 中也有对应的更强大版本。
:::
