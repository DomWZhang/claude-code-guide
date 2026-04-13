# Hooks 钩子系统

Hooks 允许你在 Claude Code 的关键生命周期节点注入自定义逻辑，实现自动化工作流、安全控制、上下文增强等功能。它们不是 Git Hooks，而是 Claude Code 专属的事件拦截机制。

## 核心概念

Claude Code 的 Hooks 基于 **事件驱动模型**：

```
用户输入 → [User Hook] → Claude 处理 → [Bot Hook] → 输出
    ↑                                              ↓
    └──────────── [Stop Hook] ← Ctrl+C ←──────────┘

启动 → [Attach Hook] → 运行中 → [Detach Hook] → 退出
```

与 Git Hooks（`.git/hooks/`）不同，Claude Code Hooks 位于用户级别的 `~/.claude/hooks/` 或项目级别的 `.claude/hooks/` 目录中。

## 可用 Hook 类型

Claude Code 支持 8 种 Hook，定义在 `settings.json` 中：

```json
{
  "hooks": {
    "User": ".claude/hooks/user-hook.sh",
    "Bot": ".claude/hooks/bot-hook.sh",
    "Stop": ".claude/hooks/stop-hook.sh",
    "Attach": ".claude/hooks/attach-hook.sh",
    "Detach": ".claude/hooks/detach-hook.sh",
    "Permissions": ".claude/hooks/permissions-hook.sh",
    "MobileResume": ".claude/hooks/mobile-resume-hook.sh",
    "McpCallback": ".claude/hooks/mcp-callback-hook.sh"
  }
}
```

每个 Hook 是一个**可执行脚本**，接收 JSON 数据（通过 stdin），可选择性地输出 JSON 信号（通过 stdout）来控制后续行为。

### 1. User Hook — 拦截用户消息

**触发时机**：每次用户发送消息后、Claude 处理前执行。

**典型用途**：
- 过滤敏感信息
- 自动添加上下文前缀
- 路由到不同的 Agent
- 输入验证

```bash
#!/bin/bash
# .claude/hooks/user-hook.sh

# 读取用户输入（JSON 格式）
read -r input

# 提取消息内容
MESSAGE=$(echo "$input" | jq -r '.message // empty')

if [[ -z "$MESSAGE" ]]; then
  echo '{}'  # 无消息，不做处理
  exit 0
fi

# 示例：检测并标记包含"紧急"的任务
if echo "$MESSAGE" | grep -qi "紧急\|urgent\|ASAP"; then
  echo '{"priority": "high", "notify_slack": true}' >&1
fi

# 示例：验证 Issue 编号格式（团队规范）
if echo "$MESSAGE" | grep -qE '#[0-9]{3,}'; then
  ISSUE_NUM=$(echo "$MESSAGE" | grep -oE '#[0-9]+' | head -1)
  echo "{\"context\": \"参考 Issue $ISSUE_NUM\", \"inject\": true}" >&1
fi

# 返回空对象表示放行（标准退出）
echo '{}'
```

**输出信号**：
- `{}` — 放行，继续正常处理
- `{"BLOCK": true, "reason": "..."}` — 阻止并返回原因
- `{"inject": true, "context": "..."}` — 注入额外上下文

### 2. Bot Hook — 拦截模型响应

**触发时机**：每次 Claude 输出响应后、显示给用户前执行。

**典型用途**：
- 敏感信息脱敏
- 响应格式化
- 自动追加文档链接
- 成本记录

```bash
#!/bin/bash
# .claude/hooks/bot-hook.sh

read -r input

# 提取响应内容和 token 使用量
RESPONSE=$(echo "$input" | jq -r '.response // empty')
INPUT_TOKENS=$(echo "$input" | jq -r '.usage.input_tokens // 0')
OUTPUT_TOKENS=$(echo "$input" | jq -r '.usage.output_tokens // 0')

# 示例：脱敏处理
CLEANED=$(echo "$RESPONSE" | sed -E 's/sk-[a-zA-Z0-9]{20,}/[REDACTED_KEY]/g')

# 示例：记录 token 使用（用于成本监控）
if [[ $OUTPUT_TOKENS -gt 5000 ]]; then
  echo "[$(date)] Large response: ${OUTPUT_TOKENS} output tokens" >> ~/.claude/logs/token-usage.log
fi

# 输出修改后的响应（留空表示不做修改）
echo "{}"
```

### 3. Stop Hook — 任务中断处理

**触发时机**：用户按 `Ctrl+C` 停止正在执行的任务时。

**典型用途**：
- 资源清理
- 状态保存（checkpoint）
- 中断日志记录

```bash
#!/bin/bash
# .claude/hooks/stop-hook.sh

read -r input

STOPPED_TASK=$(echo "$input" | jq -r '.task // "unknown"')
STOPPED_AT=$(echo "$input" | jq -r '.timestamp // now')
PARTIAL_STATE=$(echo "$input" | jq -r '.partial_state // "{}"')

# 保存中断状态供后续恢复
cat > ~/.claude/checkpoints/${STOPPED_TASK}_$(date +%s).json << EOF
{
  "task": "$STOPPED_TASK",
  "stopped_at": "$STOPPED_AT",
  "partial_state": $PARTIAL_STATE
}
EOF

# 清理临时文件
rm -f /tmp/claude-build-* 2>/dev/null

echo '{"cleanup": true}'
```

### 4. Attach Hook — 启动时执行

**触发时机**：Claude Code 启动并附加到项目时执行（项目目录下运行 `claude` 命令时）。

**典型用途**：
- 加载项目特定环境
- 检查依赖完整性
- 设置工作区状态

```bash
#!/bin/bash
# .claude/hooks/attach-hook.sh

read -r input

PROJECT_PATH=$(echo "$input" | jq -r '.cwd // "."')

# 示例：自动检查依赖
if [[ -f "$PROJECT_PATH/package.json" ]]; then
  if [[ ! -d "$PROJECT_PATH/node_modules" ]]; then
    echo "{\"warning\": \"node_modules 未安装，运行 'npm install' 可能会用到\"}" >&2
  fi
fi

# 示例：检查 CLAUDE.md 是否存在
if [[ ! -f "$PROJECT_PATH/CLAUDE.md" ]]; then
  echo "{\"warning\": \"项目缺少 CLAUDE.md，建议创建一个\"}" >&2
fi

# 示例：从 .env.local 加载环境信息到上下文
if [[ -f "$PROJECT_PATH/.env.local" ]]; then
  CONTEXT=$(grep -v '^#' "$PROJECT_PATH/.env.local" | grep '=' | head -5 | sed 's/=.*/=[已设置]/' | tr '\n' ' ')
  echo "{\"context\": \"环境变量: $CONTEXT\"}" >&1
fi

echo '{}'
```

### 5. Detach Hook — 退出时执行

**触发时机**：Claude Code 正常退出或意外断开时。

**典型用途**：
- 保存会话摘要到 Memory
- 清理临时文件
- 发送完成通知

```bash
#!/bin/bash
# .claude/hooks/detach-hook.sh

read -r input

SESSION_ID=$(echo "$input" | jq -r '.session_id // "unknown"')
DURATION=$(echo "$input" | jq -r '.duration // 0')
TASKS_COMPLETED=$(echo "$input" | jq -r '.tasks_completed // 0')

# 示例：将会话摘要追加到项目记忆文件
if [[ -f ".claude/memory/sessions.md" ]]; then
  cat >> .claude/memory/sessions.md << EOF
## Session $SESSION_ID

- 时长: ${DURATION}s
- 完成任务: $TASKS_COMPLETED
- 时间: $(date -Iseconds)
EOF
fi

# 示例：清理临时构建产物
rm -rf /tmp/claude-* 2>/dev/null

echo '{}'
```

### 6. Permissions Hook — 权限决策

**触发时机**：Claude Code 请求执行敏感操作（危险命令、写文件等）前。

**典型用途**：
- 自动批准白名单内的命令
- 自动拒绝危险操作
- 记录所有权限请求

```bash
#!/bash
#!/bin/bash
# .claude/hooks/permissions-hook.sh

read -r input

COMMAND=$(echo "$input" | jq -r '.command // ""')
OPERATION=$(echo "$input" | jq -r '.operation // ""')
REASON=$(echo "$input" | jq -r '.reason // ""')

# 记录权限请求
echo "[$(date +%Y-%m-%dT%H:%M:%S)] $OPERATION: $COMMAND (reason: $REASON)" \
  >> ~/.claude/logs/permissions.log

# 示例：自动批准安全的读操作
if echo "$COMMAND" | grep -qE '^(cat|head|tail|grep|find|ls|git status|git diff)'; then
  echo '{"decision": "ALLOW", "remember": true}'
  exit 0
fi

# 示例：自动拒绝危险操作
if echo "$COMMAND" | grep -qE '(rm -rf /|dd if=.*of=/dev/|:(){ :|:& };:|\bmkfs\b)'; then
  echo '{"decision": "DENY", "reason": "检测到极高危命令"}'
  exit 0
fi

# 示例：rm 命令需要确认（不自动批准也不拒绝）
if echo "$COMMAND" | grep -qE 'rm '; then
  echo '{"decision": "ESCALATE"}'
  exit 0
fi

# 默认：交给用户决定
echo '{"decision": "ESCALATE"}'
```

**输出信号**：
- `{"decision": "ALLOW", "remember": true}` — 自动批准并记住本次决策
- `{"decision": "DENY", "reason": "..."}` — 自动拒绝
- `{"decision": "ESCALATE"}` — 交回给用户确认

### 7. MobileResume Hook — 移动端恢复

**触发时机**：用户从移动设备恢复一个桌面会话时。

**典型用途**：
- 调整界面布局
- 精简上下文适配移动端
- 发送恢复通知

```bash
#!/bin/bash
# .claude/hooks/mobile-resume-hook.sh

read -r input

SESSION_ID=$(echo "$input" | jq -r '.session_id // ""')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_size // 0')

# 如果上下文过大，建议压缩
if [[ $CONTEXT_SIZE -gt 150000 ]]; then
  echo '{"suggest": "/compact", "reason": "上下文过大，移动端体验不佳"}'
else
  echo '{}'
fi
```

### 8. McpCallback Hook — MCP 事件回调

**触发时机**：MCP 服务器发送回调事件时。

**典型用途**：
- MCP 工具调用日志
- 响应数据处理
- 连接状态监控

```bash
#!/bin/bash
# .claude/hooks/mcp-callback-hook.sh

read -r input

SERVER=$(echo "$input" | jq -r '.server // "unknown"')
EVENT=$(echo "$input" | jq -r '.event // ""')
PAYLOAD=$(echo "$input" | jq -r '.payload // "{}"')

# 示例：记录 MCP 调用
echo "[$(date +%Y-%m-%dT%H:%M:%S)] MCP $SERVER: $EVENT" \
  >> ~/.claude/logs/mcp-calls.log

echo '{}'
```

## 实战配置示例

### 完整的 settings.json Hooks 配置

```json
{
  "model": "sonnet",
  "max_tokens": 8192,

  "hooks": {
    "Attach": ".claude/hooks/attach.sh",
    "Detach": ".claude/hooks/detach.sh",
    "User": ".claude/hooks/user.sh",
    "Bot": ".claude/hooks/bot.sh",
    "Stop": ".claude/hooks/stop.sh",
    "Permissions": ".claude/hooks/permissions.sh",
    "MobileResume": ".claude/hooks/mobile-resume.sh",
    "McpCallback": ".claude/hooks/mcp-callback.sh"
  }
}
```

### 权限白名单实战配置

一个生产级别的 `permissions.sh`，展示如何构建智能权限系统：

```bash
#!/bin/bash
# .claude/hooks/permissions.sh
set -euo pipefail

read -r input
COMMAND=$(echo "$input" | jq -r '.command // ""')
OP=$(echo "$input" | jq -r '.operation // ""')

# ============ 规则层 ============

# 规则 1：始终允许的读操作
ALLOW_READ='^(cat|head|tail|grep|find|ls|stat|wc|file|git (status|log|diff|show|branch))($| )'
if [[ "$COMMAND" =~ $ALLOW_READ ]]; then
  echo '{"decision": "ALLOW"}'
  exit 0
fi

# 规则 2：始终拒绝的破坏性操作
DENY_PATTERNS='rm -rf|drop table|dropdb|truncate|shutdown|init 0|poweroff|:(\)|:\|:&'
if [[ "$COMMAND" =~ $DENY_PATTERNS ]]; then
  echo "{\"decision\": \"DENY\", \"reason\": \"危险操作已被 Hook 拦截\"}" >&1
  exit 0
fi

# 规则 3：npm/npx 命令允许（无 --force 等危险标志时）
if [[ "$COMMAND" =~ ^(npm|npx) ]]; then
  if echo "$COMMAND" | grep -qE '(--force|-f|rm|--delete|uninstall)'; then
    echo '{"decision": "ESCALATE"}'
  else
    echo '{"decision": "ALLOW"}'
  fi
  exit 0
fi

# 规则 4：git push 需要检查分支
if [[ "$COMMAND" == "git push"* ]]; then
  TARGET_BRANCH=$(echo "$COMMAND" | grep -oE '(main|master|develop|staging)' | head -1 || echo "")
  if [[ -n "$TARGET_BRANCH" && "$TARGET_BRANCH" != "develop" && "$TARGET_BRANCH" != "staging" ]]; then
    echo "{\"decision\": \"ESCALATE\", \"reason\": \"向 $TARGET_BRANCH 分支推送需要确认\"}" >&1
  else
    echo '{"decision": "ALLOW"}'
  fi
  exit 0
fi

# 默认：其他操作需要用户确认
echo '{"decision": "ESCALATE"}'
```

### 自动上下文增强

通过 User Hook 自动为特定目录的操作注入上下文：

```bash
#!/bin/bash
# .claude/hooks/user.sh
set -euo pipefail

read -r input
MESSAGE=$(echo "$input" | jq -r '.message // ""')

# 检测是否在修复 bug
if echo "$MESSAGE" | grep -qiE '(bug|fix|修复|错误|报错)'; then
  # 提取相关文件路径（如果有的话）
  FILES=$(echo "$input" | jq -r '.mentioned_files // [] | .[]' 2>/dev/null)

  # 尝试从最近的 git 提交中提取上下文
  if command -v git &>/dev/null && git rev-parse --git-dir &>/dev/null; then
    LAST_BUG_COMMIT=$(git log --oneline -10 | grep -iE '(fix|bug|error|patch)' | head -1 | cut -d' ' -f1)
    if [[ -n "$LAST_BUG_COMMIT" ]]; then
      CONTEXT=$(git log -1 --format="%B" "$LAST_BUG_COMMIT" | head -3 | tr '\n' ' ')
      echo "{\"inject\": true, \"context\": \"相关修复记录: $CONTEXT\"}" >&1
      exit 0
    fi
  fi
fi

# 检测是否在实现新功能（自动关联相关规范）
if echo "$MESSAGE" | grep -qiE '(实现|添加|新增|feature|add)'; then
  if [[ -f "CLAUDE.md" ]]; then
    FEATURE_HINT=$(grep -A5 '\[features\]' CLAUDE.md 2>/dev/null | head -10 | tr '\n' ' ')
    if [[ -n "$FEATURE_HINT" ]]; then
      echo "{\"inject\": true, \"context\": \"项目规范: $FEATURE_HINT\"}" >&1
    fi
  fi
fi

echo '{}'
```

### MCP 工具调用审计

```bash
#!/bin/bash
# .claude/hooks/mcp-callback.sh
set -euo pipefail

read -r input
SERVER=$(echo "$input" | jq -r '.server // ""')
EVENT=$(echo "$input" | jq -r '.event // ""')
TOOL=$(echo "$input" | jq -r '.tool // ""')
DURATION=$(echo "$input" | jq -r '.duration_ms // 0')
RESULT_SIZE=$(echo "$input" | jq -r '.result_size // 0')

# 记录到审计日志
LOG_LINE="[$(date '+%Y-%m-%d %H:%M:%S')] server=$SERVER event=$EVENT tool=$TOOL duration=${duration}ms size=${RESULT_SIZE}B"
echo "$LOG_LINE" >> ~/.claude/logs/mcp-audit.log

# 如果 MCP 调用超过 5 秒，发出警告
if [[ $DURATION -gt 5000 ]]; then
  echo "{\"warning\": \"MCP 调用 $SERVER/$TOOL 耗时较长 (${DURATION}ms)\"}" >&2
fi

echo '{}'
```

## Hook 开发调试

### 调试技巧

**1. 使用 jq 解析输入**
```bash
# 查看 Hook 收到的原始 JSON
read -r input && echo "$input" | jq . > /tmp/hook-debug.json && cat /tmp/hook-debug.json
```

**2. 输出调试信息到 stderr（不干扰 stdout）**
```bash
echo "DEBUG: Processing $COMMAND" >&2
echo '{"decision": "ALLOW"}'  # stdout 才是返回给 Claude Code 的信号
```

**3. 测试 Hook 独立运行**
```bash
# 模拟一个 User Hook 输入
echo '{"message": "修复登录 bug", "mentioned_files": ["src/auth.ts"]}' \
  | bash .claude/hooks/user.sh

# 模拟权限请求
echo '{"command": "rm -rf /tmp/build", "operation": "bash", "reason": "cleanup"}' \
  | bash .claude/hooks/permissions.sh
```

### 常见问题

**Q: Hook 不执行？**
```bash
# 1. 检查文件是否存在
ls -la ~/.claude/hooks/

# 2. 检查文件是否可执行
chmod +x ~/.claude/hooks/*.sh

# 3. 检查 settings.json 中的路径是否正确
# 路径可以是绝对路径或相对于 ~/.claude/ 或项目根目录
```

**Q: Hook 超时？**
Claude Code 对 Hook 执行有默认超时限制。尽量让 Hook 的执行时间控制在 1 秒以内：
- 使用 `grep -q` 而非管道
- 避免调用外部 API
- 使用缓存的判断结果

**Q: Hook 阻塞了 Claude Code？**
确保 Hook 脚本在处理完所有逻辑后**总是输出 JSON**到 stdout。如果脚本提前退出但没有 echo，Claude Code 会等待 stdin 关闭。

**Q: 想禁用某个 Hook？**
从 `settings.json` 的 `hooks` 对象中删除对应的条目，或者将文件移到其他位置。

**Q: 用户级别 Hook 和项目级别 Hook 哪个优先？**
项目级别的 `.claude/hooks/` 优先级高于用户级别的 `~/.claude/hooks/`。相同名称的 Hook，项目级别的会覆盖用户级别的。

## Hook 与 Everything Claude Code

[Everything Claude Code](/guide/ecosystem/everything-claude-code) 扩展了原生 Hook 系统，提供了 20+ 事件类型，包括：

- `sessionStart` / `sessionEnd` — 跨会话记忆持久化
- `preToolUse` / `postToolUse` — 工具调用前后拦截
- `preCompact` / `suggestCompact` — 战略压缩时机决策
- `preBash` — 危险命令拦截

详细配置见 [ECC Hooks 配置指南](https://github.com/affaan-m/everything-claude-code)。

::: tip Hook 是 Claude Code 自动化的核心
通过组合使用 User Hook（输入增强）、Bot Hook（输出处理）和 Permissions Hook（安全门卫），可以构建出高度自动化的开发工作流。建议从 Permissions Hook 开始，逐步扩展到其他类型。
:::
