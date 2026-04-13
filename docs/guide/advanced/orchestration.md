# 多 Agent 编排：构建自动化工作流

本章介绍如何利用 Claude Code 的多 Agent 能力编排复杂任务，包括 Agent 协作模式、任务分解、状态管理和结果聚合。

## 为什么需要多 Agent 编排？

单 Agent 处理简单任务高效，但面对复杂场景存在局限：

| 场景 | 单 Agent 问题 | 多 Agent 方案 |
|------|--------------|---------------|
| 全栈开发 | 上下文过载，容易忽略细节 | 前端 Agent + 后端 Agent 分工 |
| 代码审查 | 审查维度单一 | 安全 Agent + 性能 Agent + 风格 Agent |
| 大规模重构 | 难以并行 | 多个 Agent 并行处理不同模块 |
| 复杂决策 | 偏见累积 | 多个 Agent 投票/对抗 |

## Agent 协作模式

### 1. 顺序链模式

```
用户任务
    ↓
Agent A (分析)
    ↓ 输出
Agent B (设计)
    ↓ 输出
Agent C (实现)
    ↓ 输出
Agent D (测试)
    ↓
最终结果
```

**实现方式**：

```markdown
# CLAUDE.md 中的工作流定义

[workflow:feature-dev]
steps:
  - agent: planner
    prompt: "分析需求并输出技术方案"
  - agent: architect
    prompt: "基于方案设计系统架构"
  - agent: tdd-guide
    prompt: "按照架构编写代码，遵循 TDD"
  - agent: code-reviewer
    prompt: "审查代码质量"
```

### 2. 并行扇出模式

```
用户任务
    ↓
任务分解器
    ├── Agent A (模块 1) ──→ 结果 A
    ├── Agent B (模块 2) ──→ 结果 B
    ├── Agent C (模块 3) ──→ 结果 C
    └── Agent D (模块 4) ──→ 结果 D
    ↓
结果聚合器
    ↓
最终输出
```

**实现方式**（使用 Everything Claude Code）：

```bash
# 使用 /multi-plan 分解任务
/multi-plan "重构整个认证模块，包括：
- 前端登录页面
- 后端 API
- 数据库迁移
- 单元测试"

# 并行执行
/multi-execute

# 指定后端任务
/multi-backend "优化 API 响应时间"

# 指定前端任务
/multi-frontend "修复登录页面的样式问题"
```

### 3. 对抗/辩论模式

```
用户问题
    ↓
Agent A (正方案) ←→ Agent B (反方案)
    ↓      辩论      ↓
    └───┬───┘
        ↓
Agent C (裁判)
    ↓
最终答案
```

**应用场景**：
- 安全审计（红队 vs 蓝队）
- 架构决策（评估多个方案）
- 代码审查（多角度评估）

## Everything Claude Code 的多 Agent 工具

ECC 提供了完整的多 Agent 编排工具集。

### 安装 PM2 运行时

```bash
# ECC 的多 Agent 命令需要 ccg-workflow 运行时
npx ccg-workflow init
```

### 核心命令

| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/multi-plan` | 将大任务分解为多个子任务 | 复杂功能开发 |
| `/multi-execute` | 并行执行分解后的任务 | 多模块并行开发 |
| `/multi-backend` | 后端服务专用编排 | 微服务后端 |
| `/multi-frontend` | 前端服务专用编排 | 多前端应用 |
| `/multi-workflow` | 通用多服务编排 | 任意多服务场景 |
| `/pm2` | PM2 服务生命周期管理 | 后台服务管理 |

### 示例：全栈功能开发

```bash
# 1. 分解任务
/multi-plan "实现用户资料页面：
- 后端：GET /api/user/:id 接口
- 前端：Profile 页面组件
- 数据库：users 表扩展
- 测试：单元测试 + E2E"

# ECC 输出任务列表：
# Task 1: backend-api - 实现用户 API
# Task 2: frontend-page - 创建 Profile 页面
# Task 3: db-migration - 添加 avatar_url 字段
# Task 4: tests - 编写测试

# 2. 执行
/multi-execute

# 3. 查看状态
/pm2 status
```

## 自定义 Agent 定义

### 创建专用 Agent

```markdown
# ~/.claude/agents/security-auditor.md
---
name: security-auditor
description: 安全审计专家，专注于漏洞检测
tools: ["Read", "Grep", "Glob"]
model: opus
---

你是安全审计专家。收到代码后，检查：
1. OWASP Top 10 漏洞
2. 硬编码密钥
3. 不安全的依赖
4. 权限配置问题

输出格式：按严重程度排序的问题列表。
```

```markdown
# ~/.claude/agents/performance-optimizer.md
---
name: performance-optimizer
description: 性能优化专家
tools: ["Read", "Grep", "Bash"]
model: sonnet
---

你是性能优化专家。分析代码后输出：
1. 性能瓶颈
2. 优化建议
3. 预期提升
4. 实施难度
```

### 编排配置

```markdown
# .claude/orchestration.yaml
workflows:
  pre-release:
    name: 发布前检查
    agents:
      - security-auditor
      - performance-optimizer
      - code-reviewer
    parallel: true
    aggregation: combine
    fail_fast: false
    
  feature-dev:
    name: 功能开发流程
    stages:
      - name: design
        agent: architect
      - name: implement
        agent: tdd-guide
        depends_on: [design]
      - name: review
        agent: code-reviewer
        depends_on: [implement]
      - name: security
        agent: security-auditor
        depends_on: [implement]
```

## 任务分解策略

### 按模块分解

```
大型重构
├── 模块 A (独立) → Agent A
├── 模块 B (独立) → Agent B
├── 模块 C (依赖 A) → Agent C (等待 A)
└── 模块 D (依赖 B) → Agent D (等待 B)
```

### 按能力分解

```
代码审查
├── 安全检查 → security-agent
├── 性能分析 → performance-agent
├── 风格检查 → linter-agent
└── 逻辑审查 → logic-agent
```

### 按阶段分解

```
数据分析流水线
├── 数据清洗 → clean-agent
├── 特征工程 → feature-agent
├── 模型训练 → train-agent
└── 结果评估 → eval-agent
```

## 状态管理与通信

### 共享上下文文件

```markdown
# .claude/orchestration/context.md
## 当前任务状态
- 任务 ID: feature-001
- 阶段: 实现中
- 已完成: 数据库迁移
- 进行中: API 开发
- 待处理: 前端集成

## Agent 输出汇总
### security-auditor
- 发现 2 个中危问题
- 建议: 升级 bcrypt 到 5.1+

### performance-optimizer
- 发现 1 个性能瓶颈
- 建议: 添加数据库索引
```

### Agent 间消息传递

```bash
# Agent A 输出结果到文件
claude -p "分析代码，输出结果到 /tmp/analysis.json"

# Agent B 读取 Agent A 的结果
claude -p "基于 /tmp/analysis.json 的结果，设计优化方案"
```

## Everything Claude Code 高级编排

### 使用 /multi-workflow

```bash
/multi-workflow "部署流程：
1. 运行测试
2. 构建生产包
3. 更新数据库 schema
4. 重启服务
5. 健康检查"
```

### 使用 PM2 管理后台 Agent

```bash
# 启动后台 Agent 服务
/pm2 start claude-code-agent --name code-reviewer

# 查看所有服务
/pm2 list

# 查看日志
/pm2 logs code-reviewer

# 停止服务
/pm2 stop code-reviewer
```

### ECC 内置的编排 Agent

| Agent | 职责 |
|-------|------|
| `planner` | 任务分解与规划 |
| `architect` | 系统架构设计 |
| `tdd-guide` | TDD 流程引导 |
| `code-reviewer` | 代码审查 |
| `security-reviewer` | 安全审计 |
| `build-error-resolver` | 构建错误修复 |
| `e2e-runner` | E2E 测试执行 |
| `refactor-cleaner` | 代码清理 |
| `doc-updater` | 文档更新 |
| `orchestrator` | 多 Agent 协调 |

## 实战示例：自动化发布流程

```bash
# 1. 规划
/plan "准备 v2.0.0 发布：
- 运行所有测试
- 更新 CHANGELOG
- 构建生产版本
- 安全扫描
- 性能测试
- 部署到 staging"

# 2. 执行编排
/multi-workflow --config .claude/release-workflow.yaml

# 3. 监控
/loop 1m "检查部署状态，如果成功则发送通知"
```

## 最佳实践

### 1. 保持 Agent 单一职责

```
✅ 一个 Agent 只做一件事
❌ 创建一个"万能 Agent"
```

### 2. 明确依赖关系

```yaml
depends_on:
  - task: database-migration
    condition: success
  - task: api-tests
    condition: all_pass
```

### 3. 设置超时和重试

```yaml
timeout: 300  # 5 分钟
retry: 3
retry_delay: 10  # 秒
```

### 4. 结果验证

每个 Agent 完成后应输出可验证的结果：
- 测试通过率
- 代码覆盖率
- 安全扫描分数
- 性能指标

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| Agent 死锁 | 检查依赖关系，避免循环依赖 |
| 上下文爆炸 | 每个 Agent 独立上下文，结果只传递必要信息 |
| 结果冲突 | 使用仲裁 Agent 或投票机制 |
| 执行超时 | 拆分任务，增加超时配置 |

## 总结

多 Agent 编排的核心价值在于：
- **并行化**：同时处理多个独立任务
- **专业化**：每个 Agent 专注其领域
- **可扩展**：轻松添加新的 Agent
- **可靠性**：单个 Agent 失败不影响整体

结合 Everything Claude Code 的编排工具，可以构建从开发到部署的全自动化流水线。
