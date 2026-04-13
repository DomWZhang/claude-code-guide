# Everything Claude Code：最强大的 Claude Code 生态工具集

Everything Claude Code（ECC）是目前 Claude Code 生态中最全面、最活跃的开源工具集，由 Affaan Mustafa 创建，在 Anthropic 黑客松中获奖。它提供了 38 个专业 Agents、156 个 Skills、79 个命令兼容层，以及跨平台的配置管理能力。

## 为什么需要 ECC？

原生 Claude Code 提供了基础能力，但 ECC 将其扩展为**生产级 AI 工程系统**：

| 维度 | 原生 Claude Code | Everything Claude Code |
|------|----------------|------------------------|
| Agents | 基础 subagent 支持 | 38 个专业化 Agents（代码审查、架构、安全、构建修复等） |
| Skills | 无原生技能系统 | 156 个可复用技能，支持自动学习与进化 |
| Rules | 单一 CLAUDE.md | 分级规则（common + 语言特定），自动合并 |
| Hooks | 基础钩子 | 20+ 事件类型，跨会话记忆持久化 |
| 跨平台 | 仅 Claude Code | Cursor、Codex、OpenCode、Antigravity、Gemini |
| 持续学习 | 无 | 基于置信度的 instinct 学习系统 |
| 安全审计 | 无 | AgentShield 集成，102 条规则，1282 测试 |

## 核心组件

### 1. Agents（38 个）

ECC 提供高度专业化的 subagent，每个专注于特定任务：

| Agent | 用途 |
|-------|------|
| `planner` | 功能实现规划，输出可执行步骤 |
| `architect` | 系统架构设计决策 |
| `tdd-guide` | 测试驱动开发全流程 |
| `code-reviewer` | 代码质量与安全审查 |
| `security-reviewer` | 漏洞分析与渗透测试视角 |
| `build-error-resolver` | 构建错误自动修复 |
| `e2e-runner` | Playwright E2E 测试生成与执行 |
| `refactor-cleaner` | 死代码清理与重构 |
| `doc-updater` | 文档同步与更新 |
| `typescript-reviewer` | TypeScript/JavaScript 专项审查 |
| `go-reviewer` / `go-build-resolver` | Go 生态 |
| `python-reviewer` | Python 生态 |
| `java-reviewer` / `java-build-resolver` | Java/Spring Boot 生态 |
| `kotlin-reviewer` / `kotlin-build-resolver` | Kotlin/Android 生态 |
| `rust-reviewer` / `rust-build-resolver` | Rust 生态 |
| `cpp-reviewer` / `cpp-build-resolver` | C++ 生态 |
| `database-reviewer` | SQL、迁移、性能审查 |

### 2. Skills（156 个）

Skills 是 ECC 的核心工作流单元，分为多个类别：

**开发流程类**
- `tdd-workflow`：红灯→绿灯→重构完整循环
- `verification-loop`：构建→测试→lint→类型检查→安全
- `strategic-compact`：上下文压缩时机决策
- `e2e-testing`：Playwright 端到端测试模式

**语言/框架类**
- `typescript-patterns`、`python-patterns`、`golang-patterns`
- `django-patterns`、`springboot-patterns`、`laravel-patterns`
- `nextjs-patterns`、`react-patterns`

**架构与设计类**
- `backend-patterns`：API、数据库、缓存模式
- `frontend-patterns`：组件、状态管理、性能
- `api-design`：RESTful、OpenAPI、版本控制
- `database-migrations`：Prisma、Drizzle、Alembic、Flyway

**内容与运营类**
- `article-writing`：长文写作，消除 AI 腔
- `market-research`：带来源引用的市场调研
- `investor-materials`：Pitch deck、财务模型
- `frontend-slides`：零依赖 HTML 演示文稿

**持续学习类**
- `continuous-learning-v2`：基于 instinct 的模式学习
- `skill-stocktake`：审计技能与命令质量

### 3. Rules（分级规则系统）

ECC 的规则架构分为两层：

```
rules/
├── common/           # 语言无关原则（始终安装）
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md（TDD，80% 覆盖率）
│   ├── performance.md
│   ├── security.md
│   └── hooks.md
├── typescript/       # TypeScript/JavaScript 专项
├── python/           # Python 专项
├── golang/           # Go 专项
├── swift/            # Swift 专项
├── php/              # PHP 专项
├── java/             # Java 专项
├── rust/             # Rust 专项
└── cpp/              # C++ 专项
```

**关键规则示例**：

```markdown
# common/testing.md
- 所有新功能必须有测试
- 测试覆盖率目标 > 80%
- 单元测试覆盖核心逻辑
- 集成测试覆盖关键流程

# common/security.md
- 禁止硬编码密钥，使用环境变量
- 输入验证：所有用户输入必须验证
- SQL 注入防护：使用参数化查询
- XSS 防护：输出编码或使用 sanitize
```

### 4. Hooks（20+ 事件类型）

ECC 的钩子系统远丰富于原生 Claude Code：

| 事件类型 | 用途 |
|---------|------|
| `sessionStart` | 加载跨会话记忆，注入项目上下文 |
| `sessionEnd` | 提取本次会话模式，保存学习成果 |
| `preToolUse` | 工具调用前检查（权限、成本） |
| `postToolUse` | 工具调用后处理（格式化、审计） |
| `preCompact` | 压缩前保存关键状态 |
| `suggestCompact` | 主动建议压缩时机 |
| `preBash` | 危险命令拦截（rm -rf、git push --force） |

**核心钩子实现**（`hooks/hooks.json`）：
- **记忆持久化**：`session-start.js` 加载历史上下文，`session-end.js` 保存新模式
- **战略压缩**：`suggest-compact.js` 在逻辑断点提示 `/compact`
- **安全拦截**：`pre-bash.js` 检测危险命令并请求确认

### 5. MCP 配置

ECC 内置 14 个 MCP 服务器配置：

```json
{
  "mcpServers": {
    "github": { "command": "npx", "args": ["-y", "@anthropic-ai/mcp-server-github"] },
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
    "exa": { "command": "npx", "args": ["-y", "@anthropic-ai/mcp-server-exa"] },
    "playwright": { "command": "npx", "args": ["-y", "@anthropic-ai/mcp-server-playwright"] },
    "sequential-thinking": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"] },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] }
  }
}
```

## 安装与配置

### 快速安装（推荐）

```bash
# 1. 添加 ECC 市场
/plugin marketplace add https://github.com/affaan-m/everything-claude-code

# 2. 安装插件
/plugin install ecc@ecc

# 3. 克隆仓库获取 rules（插件无法自动分发 rules）
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code

# 4. 安装 rules（选择语言）
./install.sh --profile full
# 或仅安装特定语言：./install.sh typescript python golang
```

### 选择性安装

```bash
# 仅安装 TypeScript 规则
./install.sh typescript

# 安装到 Cursor IDE
./install.sh --target cursor typescript

# 安装到 Antigravity
./install.sh --target antigravity typescript

# 安装到 Gemini CLI
./install.sh --target gemini --profile full
```

### 手动安装核心组件

```bash
# Agents
cp -r everything-claude-code/agents/*.md ~/.claude/agents/

# Skills（核心技能）
cp -r everything-claude-code/skills/tdd-workflow ~/.claude/skills/
cp -r everything-claude-code/skills/verification-loop ~/.claude/skills/
cp -r everything-claude-code/skills/strategic-compact ~/.claude/skills/
cp -r everything-claude-code/skills/continuous-learning-v2 ~/.claude/skills/

# Rules
mkdir -p ~/.claude/rules
cp -r everything-claude-code/rules/common ~/.claude/rules/
cp -r everything-claude-code/rules/typescript ~/.claude/rules/

# Hooks（合并到 settings.json）
# 参考 hooks/hooks.json 中的配置
```

## 核心功能详解

### 1. 持续学习系统（Continuous Learning v2）

ECC 能够从每次会话中自动学习并保存模式：

```bash
# 查看已学习的 instincts（模式）
/instinct-status

# 导出你的 instincts（分享给团队）
/instinct-export

# 导入他人的 instincts
/instinct-import <file>

# 将相关 instincts 聚类为技能
/evolve
```

**工作原理**：
1. `session-end` 钩子调用 `evaluate-session.js`
2. 分析本次对话中的代码模式、决策、修复
3. 计算置信度分数（基于重复出现次数、用户确认）
4. 存储到 `~/.claude/instincts/`
5. 下次会话自动加载高置信度 instincts

### 2. 战略压缩（Strategic Compaction）

原生 Claude Code 在上下文达到 95% 时才自动压缩，但此时可能已丢失关键信息。ECC 的 `suggest-compact` 钩子在逻辑断点主动提示：

**何时压缩**（钩子判断逻辑）：
- 完成调研后、开始实现前
- 完成一个里程碑后
- 调试完成后、继续功能开发前
- 失败方案尝试后、换新方案前

**何时不压缩**：
- 实现进行中（会丢失变量名、文件路径）

### 3. Token 优化配置

ECC 推荐以下 settings 显著降低使用成本：

```json
// ~/.claude/settings.json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

| 设置 | 效果 |
|------|------|
| `model: sonnet` | 相比 Opus 降低 ~60% 成本，覆盖 80% 任务 |
| `MAX_THINKING_TOKENS: 10000` | 减少 ~70% 隐藏思考成本 |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: 50` | 50% 时主动压缩，避免上下文膨胀 |
| `subagent_model: haiku` | 子代理使用 Haiku，进一步降本 |

### 4. 跨平台支持

ECC 不仅支持 Claude Code，还完整适配其他 AI 编码工具：

**Cursor IDE**
```bash
./install.sh --target cursor typescript
# 生成 .cursor/hooks/、.cursor/rules/、.cursor/mcp.json
```

**Codex CLI / macOS App**
```bash
# 自动同步 ECC 资产到 ~/.codex/
npm install && bash scripts/sync-ecc-to-codex.sh
```

**OpenCode**
```bash
# 直接运行即可自动检测 .opencode/opencode.json
opencode
```

## 与原生 Claude Code 的对比

| 使用场景 | 原生 Claude Code | 使用 ECC |
|---------|-----------------|----------|
| 新功能开发 | 手动规划，容易遗漏 | `/plan` + `tdd` 全流程自动化 |
| 代码审查 | 口头描述审查要点 | `/code-review` 按 20+ 标准检查 |
| 构建错误 | 复制错误到对话框 | `/build-fix` 自动分析并修复 |
| 跨会话上下文 | 每次重新说明 | hooks 自动保存/加载项目状态 |
| 多语言项目 | 手动配置规则 | 按语言自动加载专项规则 |
| 成本控制 | 手动切换模型 | 配置文件 + 钩子提示 |
| 安全审计 | 手动检查 | `/security-scan` 102 条规则 |

## 常用命令速查

| 命令 | 功能 |
|------|------|
| `/ecc:plan "描述"` | 规划新功能 |
| `/tdd` | 测试驱动开发工作流 |
| `/code-review` | 代码审查 |
| `/build-fix` | 修复构建错误 |
| `/e2e` | 生成 E2E 测试 |
| `/security-scan` | 安全审计 |
| `/refactor-clean` | 清理死代码 |
| `/update-docs` | 更新文档 |
| `/instinct-status` | 查看学习到的模式 |
| `/evolve` | 将模式聚类为技能 |
| `/strategic-compact` | 手动触发战略压缩 |
| `/checkpoint` | 保存验证状态 |
| `/verify` | 运行验证循环 |
| `/multi-plan` | 多 Agent 任务分解 |
| `/multi-execute` | 多 Agent 协同执行 |

## 故障排除

### Hooks 重复加载错误

**错误**：`Duplicate hooks file detected: ./hooks/hooks.json`

**原因**：Claude Code v2.1+ 自动加载 `hooks/hooks.json`，在 `plugin.json` 中显式声明会导致重复。

**解决**：确保 `.claude-plugin/plugin.json` 中**没有** `"hooks"` 字段。

### 规则未生效

```bash
# 检查规则是否正确安装
ls -la ~/.claude/rules/

# 确认文件权限
chmod 644 ~/.claude/rules/common/*.md
```

### 记忆未跨会话保存

检查 hooks 配置是否完整加载：
```bash
# 查看 hook 日志
tail -f ~/.claude/logs/hooks.log
```

## 生态工具矩阵

| 工具 | 定位 | 核心能力 |
|------|------|---------|
| **Everything Claude Code** | 全能扩展包 | 38 Agents、156 Skills、跨平台 |
| **AgentShield** | 安全审计 | 102 规则、1282 测试、三 Agent 对抗 |
| **Skill Creator** | 技能生成 | 从 Git 历史自动提取模式生成 SKILL.md |
| **ECC Tools GitHub App** | 团队协作 | 自动 PR、10k+ 提交分析、团队共享 |
| **ccg-workflow** | 多模型编排 | PM2 管理、多服务工作流 |

## 最佳实践

1. **从最小安装开始**：先用 TypeScript/Python 规则 + 核心 skills，按需添加
2. **启用持续学习**：允许 `session-end` 钩子提取模式，几周后 Claude 会"懂你"
3. **定期审视 instincts**：`/instinct-status` 检查是否有错误模式被学习
4. **团队共享 instincts**：导出的 instincts 文件可纳入版本控制，团队统一
5. **结合 MCP**：启用 Context7 获取最新文档，Playwright 做自动化测试

## 资源链接

- [GitHub 仓库](https://github.com/affaan-m/everything-claude-code)
- [速查指南（Twitter）](https://x.com/affaanmustafa/status/2012378465664745795)
- [长文指南（Twitter）](https://x.com/affaanmustafa/status/2014040193557471352)
- [安全指南](https://x.com/affaanmustafa/status/2033263813387223421)
- [AgentShield](https://github.com/affaan-m/agentshield)

::: tip
Everything Claude Code 是目前 Claude Code 生态中最成熟的扩展。建议所有中重度用户安装，尤其是团队协作和跨平台开发场景。
:::
