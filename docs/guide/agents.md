# Agent 系统

Agent（智能体）是 Claude Code 最强大的特性之一。通过自定义 Agent，你可以创建专门配置的 AI 实例，针对特定任务类型（如代码审查、Bug 修复、文档生成等）进行深度优化，实现专业化工作流。

## Agent 概述

### 什么是 Agent？

Agent 是一个经过专门配置的 Claude 实例，拥有自己的系统提示词、工具集和行为规范。相比通用对话，Agent 能够：

- **专注特定领域**：如代码审查、安全扫描、API 设计
- **保持一致风格**：每次交互都遵循相同的行为规范
- **降低上下文污染**：不同任务的上下文相互隔离
- **提升输出质量**：专业化带来更高准确率

### Agent vs 普通对话

```
普通对话：
用户 → [通用 Claude] → 结果（需每次说明上下文）

Agent 对话：
用户 → [专业审查 Agent] → 高质量审查结果（上下文已内置）
用户 → [API 设计 Agent] → 专业 API 方案（无需每次说明）
```

## 内置 Agent

Claude Code 提供 5 个内置 Agent，可直接使用：

| Agent | 模型 | 用途 |
|-------|------|------|
| `claude-code-guide` | haiku | 专门用于学习 Claude Code 使用 |
| `Explore` | haiku | 快速探索代码库、理解项目结构 |
| `general-purpose` | inherit | 通用任务（默认使用） |
| `Plan` | inherit | 复杂任务的规划与分解 |
| `statusline-setup` | sonnet | 配置 Claude Code 状态栏 |

查看所有已配置的 Agent：

```bash
claude agents
# 输出：
# 5 active agents
# Built-in agents:
#   claude-code-guide · haiku
#   Explore · haiku
#   general-purpose · inherit
#   Plan · inherit
#   statusline-setup · sonnet
```

## 使用 Agent

### 会话中切换 Agent

在交互式会话中，使用 `/agent` 命令或 `--agent` 选项：

```bash
# 启动时指定 Agent
claude --agent Explore

# 会话中切换
/agent review
```

### 创建自定义 Agent

使用 `--agents` 选项以 JSON 格式定义自定义 Agent：

```bash
claude --agents '{
  "review": {
    "description": "专业的代码审查专家",
    "prompt": "你是一位经验丰富的代码审查专家，专注于以下方面：\n1. TypeScript 类型安全\n2. 错误处理完整性\n3. 性能问题识别\n4. 安全漏洞检测\n5. 代码风格一致性\n\n审查时请：\n- 给出具体的问题位置和修复建议\n- 对严重问题使用 ⚠️ 标记\n- 对最佳实践建议使用 💡 标记\n- 总结构键改进点"
  },
  "architect": {
    "description": "系统架构设计师",
    "prompt": "你是一位资深系统架构师。设计时需考虑：\n1. 可扩展性：系统如何随业务增长而演进\n2. 可维护性：代码库的健康度和团队协作效率\n3. 性能：响应时间和资源利用率\n4. 安全性：认证、授权、数据保护\n5. 成本效益：基础设施和开发维护成本\n\n请先理解现有系统，再提出改进方案。",
    "model": "opus"
  }
}'
```

JSON 格式的 Agent 定义支持以下字段：

| 字段 | 必需 | 说明 |
|------|------|------|
| `description` | 是 | Agent 描述（用于 `/agent` 命令的提示） |
| `prompt` | 是 | Agent 的系统提示词（定义其角色和行为） |
| `model` | 否 | 指定模型（默认 inherit，使用当前会话模型） |
| `tools` | 否 | 限制可用工具（默认全部可用） |

### 持久化 Agent 配置

通过 `settings.json` 持久化 Agent 定义：

```json
{
  "agents": {
    "review": {
      "description": "专业的代码审查专家",
      "prompt": "你是一位经验丰富的代码审查专家..."
    },
    "architect": {
      "description": "系统架构设计师",
      "prompt": "你是一位资深系统架构师..."
    }
  }
}
```

这样就可以在任意会话中使用这些 Agent：

```bash
claude --agent review
claude --agent architect
```

## Agent 最佳实践

### 1. 明确角色定位

Agent 的 prompt 应该清晰定义其**角色、专业领域和工作方式**：

```json
{
  "description": "React 性能优化专家",
  "prompt": "你是 React 性能优化专家。你专注于：\n- React Profiler 分析\n- 渲染优化（memo、useMemo、useCallback）\n- 列表虚拟化\n- 代码分割与懒加载\n- 状态管理优化\n\n你的工作方式：\n1. 先运行性能分析工具\n2. 识别主要瓶颈\n3. 按影响程度排序修复\n4. 每项修复后验证效果"
}
```

### 2. 使用具体约束

在 prompt 中添加具体约束，避免泛泛而谈：

```
✅ "审查时必须给出具体代码行号和修复建议"
✅ "输出格式：问题描述 → 影响评估 → 修复代码"
✅ "每条建议必须包含性能影响程度的评级（高/中/低）"
```

### 3. 模型选择

| 任务类型 | 推荐 Agent 模型 | 说明 |
|----------|---------------|------|
| 简单重复任务 | haiku | 成本最低，速度快 |
| 日常开发 | inherit (sonnet) | 平衡质量与成本 |
| 复杂推理/架构设计 | opus | 深度推理能力 |
| 代码审查 | inherit (sonnet) 或 haiku | 取决于代码复杂度 |

### 4. 工具限制

对于专业 Agent，限制工具集可以提高专注度和降低成本：

```json
{
  "description": "只读代码分析 Agent",
  "prompt": "你是一位代码分析专家，只分析代码，不做修改。",
  "tools": ["Read", "Glob", "Grep"]
}
```

可用工具名：`Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `TodoWrite`, `AskUserQuestion`, `WebSearch`, `WebFetch`, `NotebookEdit`, `ScheduleWakeup`, `TaskStop`, `TaskOutput` 等。

## Agent 工作流示例

### 示例 1：代码审查 Agent

```bash
# 定义审查 Agent
claude --agents '{
  "review": {
    "description": "代码审查",
    "prompt": "你是一位高级代码审查专家。审查范围包括：\n\n1. **正确性**：逻辑错误、边界条件、类型安全\n2. **安全性**：注入攻击、权限问题、敏感信息泄露\n3. **性能**：不必要的重渲染、内存泄漏、算法复杂度\n4. **可维护性**：代码复杂度、命名规范、注释质量\n\n输出格式：\n## 审查结果\n\n### 🔴 严重问题\n（影响安全或正确性的问题）\n\n### 🟡 需要改进\n（性能、可维护性问题）\n\n### 🟢 建议优化\n（代码风格、最佳实践）\n\n### 总结\n- 问题总数：X\n- 严重：X | 改进：X | 建议：X"
  }
}' --agent review

# 输入审查需求
请审查 src/auth/login.ts 的实现质量
```

### 示例 2：多 Agent 协作

大型任务可以由多个 Agent 接力完成：

```bash
# 阶段 1：架构设计
claude --agent architect
请为这个微服务项目设计数据库架构

# 阶段 2：代码生成（切换 Agent）
/agent general-purpose
基于刚才的架构设计，生成数据库迁移脚本

# 阶段 3：审查（再切回审查 Agent）
/agent review
审查刚才生成的迁移脚本
```

### 示例 3：快速探索

```bash
# 使用内置 Explore Agent 快速理解代码库
claude --agent Explore

# 输入
探索这个项目的整体架构，列出主要模块及其职责
```

### 示例 4：任务规划

```bash
# 使用内置 Plan Agent 分解复杂任务
claude --agent Plan

# 输入
从零搭建一个包含用户认证、权限管理、RESTful API 的 Node.js 后端项目
```

## Agent 与上下文管理

### Agent 间上下文隔离

每个 Agent 的 `--agents` JSON 定义是独立的，不会相互污染上下文。但如果你在会话中切换 Agent，请注意：

- **切换 Agent 时上下文保留**：之前加载的文件和对话历史仍然存在
- **使用 `/clear` 重置**：切换到新 Agent 前执行 `/clear` 可以获得干净的起点

### 推荐的 Agent 使用流程

```
1. 评估任务类型 → 选择或定义合适的 Agent
2. 执行 /clear（如需要干净上下文）
3. 启动会话：claude --agent <name>
4. 完成阶段性任务 → 使用 /compact 压缩上下文
5. 必要时切换 Agent 或开新会话
```

## 常见问题

### Q: Agent 的 prompt 最多多长？

没有硬性限制，但 prompt 本身会占用上下文空间。建议控制在 2,000 tokens 以内，复杂的规范可以放在外部文件中引用。

### Q: 如何让 Agent 记住项目的代码风格？

在 Agent 的 prompt 中引用 CLAUDE.md，或直接在 prompt 中描述项目规范：

```json
{
  "prompt": "你是一位代码审查专家。\n\n本项目的代码规范（来自 CLAUDE.md）：\n- 使用 TypeScript 5.x\n- 函数组件 + 命名导出\n- 组件最多 200 行\n\n请按上述规范审查代码。"
}
```

### Q: Agent 可以调用其他 Agent 吗？

Agent 本质上是会话配置，不支持嵌套调用。但你可以通过子代理（Subagent）机制委托任务——在 `settings.json` 中定义子代理，由主会话调度。

### Q: 如何调试 Agent 配置？

使用 `--debug` 选项查看 Agent 加载和执行详情：

```bash
claude --debug agent --agent review
```

### Q: Agent 定义可以放在单独的文件中吗？

可以。Agent 定义通常放在 `~/.claude/settings.json` 中。但你也可以通过 `--settings` 选项加载额外配置：

```bash
claude --settings ./project-agents.json --agent review
```

::: tip
想深入了解 Agent 的底层机制？请阅读[核心概念](/guide/concepts)中的 Agent 引擎详解章节。
:::
