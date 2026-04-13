# 性能优化与成本控制

Claude Code 的使用成本直接与 Token 消耗挂钩。本章从架构层面分析 Token 消耗模式，提供可量化的优化策略。

## Token 消耗模型

### 消耗组成

一次典型请求的 Token 消耗分解：

```
┌─────────────────────────────────────────────────────────────┐
│  输入 Token (占总成本 ~70%)                                  │
│  ├── 系统提示词 (System Prompt)              ~5K tokens     │
│  ├── 工具定义 (Tool Definitions)             ~15K tokens    │
│  ├── MCP 工具定义 (每额外 MCP)               ~2K each       │
│  ├── 会话历史 (对话 + 工具结果)              可变            │
│  └── 用户输入                                可变            │
├─────────────────────────────────────────────────────────────┤
│  思考 Token (Thinking)                                      │
│  ├── 内部推理过程                            ~5K-30K       │
│  └── 可通过 MAX_THINKING_TOKENS 限制                        │
├─────────────────────────────────────────────────────────────┤
│  输出 Token (占总成本 ~30%)                                  │
│  ├── 最终回复                                                │
│  └── 工具调用参数                                            │
└─────────────────────────────────────────────────────────────┘
```

### 成本计算公式

```
单次会话成本 = (输入Token × 输入单价) + (思考Token × 思考单价) + (输出Token × 输出单价)

示例 (Claude Sonnet):
- 输入: $3 / 1M tokens
- 输出: $15 / 1M tokens
- 思考: $3 / 1M tokens (与输入同价)

典型任务成本估算:
- 简单代码生成 (1000 输入 + 500 输出): ~$0.0105
- 复杂重构 (10000 输入 + 2000 输出): ~$0.06
- 全项目分析 (100000 输入 + 5000 输出): ~$0.375
```

## 优化策略矩阵

| 策略 | 预期节省 | 实施难度 | 适用场景 |
|------|---------|----------|----------|
| 默认使用 Sonnet | 60% | 低 | 所有场景 |
| 限制思考 Token | 70% | 低 | 所有场景 |
| 主动压缩 | 40% | 中 | 长会话 |
| 禁用无用 MCP | 20% | 低 | MCP 用户 |
| 子代理使用 Haiku | 80% | 中 | 大规模分析 |
| 使用 `/clear` 重置 | 100% | 低 | 任务切换 |

## 配置级优化

### 推荐配置（生产环境）

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

### 配置项详解

| 配置项 | 默认值 | 推荐值 | 原理 |
|--------|--------|--------|------|
| `model` | opus | **sonnet** | Sonnet 速度略慢但成本低 60%，覆盖 80% 任务 |
| `MAX_THINKING_TOKENS` | 31999 | **10000** | 限制内部推理 Token，大多数任务 1 万 Token 足够 |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 95 | **50** | 50% 时主动压缩，避免上下文膨胀 |
| `CLAUDE_CODE_SUBAGENT_MODEL` | opus | **haiku** | 子代理任务通常简单，Haiku 足够 |

### 模型选择决策树

```
任务是什么？
    │
    ├── 代码生成 / 简单修改 / 解释代码
    │   └── Sonnet ✅ (80% 场景)
    │
    ├── 架构设计 / 复杂重构 / 多文件协调
    │   └── Opus (需要深度推理)
    │
    ├── 批量处理 / 代码审查 / 文档生成
    │   └── Haiku (成本最低)
    │
    └── 不确定
        └── 先用 Sonnet，效果不佳再切 Opus
```

## MCP 成本控制

### MCP 的隐藏成本

每个启用的 MCP Server 会将其**工具定义**注入上下文：

```
启用 1 个 MCP (GitHub):    +2K tokens
启用 3 个 MCP:              +6K tokens
启用 10 个 MCP:             +20K tokens (消耗 10% 窗口)
```

### 按项目禁用 MCP

```json
// .claude/settings.json (项目级)
{
  "disabledMcpServers": [
    "supabase",      // 本项目不用
    "vercel",        // 本项目不用
    "slack"          // 不需要通知
  ]
}
```

### MCP 使用原则

1. **只启用必要的 MCP**：每多一个 MCP，每轮对话多消耗 2K Token
2. **项目级禁用**：在 `.claude/settings.json` 中禁用不用的 MCP
3. **定期审计**：`/mcp list` 查看当前启用的 MCP

## 会话管理优化

### 压缩时机决策

| 场景 | 推荐操作 | 原因 |
|------|----------|------|
| 调研完成，开始实现 | `/compact` | 丢弃调研细节，保留结论 |
| 完成一个里程碑 | `/compact` | 保留已完成的工作上下文 |
| 调试完成 | `/compact` | 丢弃调试过程中的试错信息 |
| 切换任务 | `/clear` | 完全重置，避免污染 |
| 任务进行中 | 不压缩 | 保持变量名、文件路径等细节 |

### 会话生命周期最佳实践

```
会话开始
    │
    ▼
任务 1: 调研数据库 schema
    │
    ▼ (调研完成)
/compact  ← 压缩调研细节，保留结论
    │
    ▼
任务 2: 编写迁移脚本
    │
    ▼ (脚本完成)
/compact  ← 压缩实现细节，保留功能
    │
    ▼
任务 3: 编写测试
    │
    ▼ (全部完成)
/exit
```

### `/clear` vs `/compact` 对比

| 操作 | 保留内容 | 丢弃内容 | 适用场景 |
|------|----------|----------|----------|
| `/compact` | CLAUDE.md、Rules、关键决策摘要 | 详细对话、工具调用细节 | 同一任务不同阶段 |
| `/clear` | 无 | 全部 | 完全不同的新任务 |

## Everything Claude Code 优化配置

ECC 提供了针对成本优化的预设配置：

```json
// ECC 推荐配置
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  },
  "hooks": {
    "suggestCompact": true  // ECC 战略压缩钩子
  }
}
```

### ECC 战略压缩钩子

ECC 的 `suggest-compact.js` 钩子在逻辑断点主动提示压缩：

- 检测到调研完成 → 提示 `/compact`
- 检测到测试通过 → 提示 `/compact`
- 检测到上下文 > 50% → 提示压缩

## 成本监控

### 实时查看成本

```
/cost
```

输出示例：
```
Session cost: $0.0432
- Input: 12,345 tokens ($0.0370)
- Thinking: 2,100 tokens ($0.0063)
- Output: 0 tokens ($0.00)

Total across all sessions (today): $0.87
```

### 设置预算告警

```json
// ~/.claude/settings.json
{
  "budget": {
    "dailyLimit": 5.00,      // 每日上限 $5
    "sessionLimit": 1.00,     // 单会话上限 $1
    "alertThreshold": 0.80    // 80% 时告警
  }
}
```

## 团队成本优化

### 共享配置

将优化配置纳入版本控制：

```bash
# 项目根目录
cat > .claude/settings.json << EOF
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
  }
}
EOF

git add .claude/settings.json
git commit -m "chore: 添加 Claude Code 成本优化配置"
```

### 团队规范

1. **默认 Sonnet**：除非明确需要 Opus，否则使用 Sonnet
2. **每日成本审查**：使用 `/cost` 检查个人消耗
3. **MCP 清单**：项目 README 中列出需要启用的 MCP
4. **定期清理**：每周清理无用会话历史

## 故障排除

### 成本异常高

| 症状 | 可能原因 | 解决方案 |
|------|----------|----------|
| 单会话成本 > $1 | MCP 过多 | 检查 `disabledMcpServers` |
| 思考 Token 异常大 | 复杂任务 | 手动 `/compact` 后重试 |
| 重复读取相同文件 | 上下文丢失 | 使用 `/clear` 重置 |
| 子代理成本高 | 子代理用 Opus | 设置 `CLAUDE_CODE_SUBAGENT_MODEL=haiku` |

### 验证配置生效

```bash
# 查看当前生效的配置
claude --print "/config show"

# 检查环境变量
claude --print "echo $MAX_THINKING_TOKENS"
```

## 总结

| 优先级 | 操作 | 预期节省 |
|--------|------|----------|
| 1 | 设置 `model: sonnet` | 60% |
| 2 | 设置 `MAX_THINKING_TOKENS: 10000` | 70% |
| 3 | 禁用不用的 MCP | 20% |
| 4 | 里程碑处手动 `/compact` | 40% |
| 5 | 子代理使用 Haiku | 80% |

**一句话总结**：配置 Sonnet + 限制思考 Token + 主动压缩 = 成本降低 80% 以上。
