# Hooks 钩子系统

Hooks 允许你在 Claude Code 执行关键操作时自动触发自定义脚本或命令。

## Hooks 概述

Hooks 是一种自动化机制，在特定事件发生时自动执行预定义的操作。

```
用户操作
    ↓
触发 Hook 事件
    ↓
执行 Hook 脚本
    ↓
继续执行 / 阻止操作
```

## Hook 类型

### 1. 提交前 Hook (pre-commit)

在 Git 提交前执行：

```bash
#!/bin/bash
# .git/hooks/pre-commit

# 检查代码格式
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed, commit aborted"
  exit 1
fi

# 运行测试
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed, commit aborted"
  exit 1
fi
```

### 2. 提交后 Hook (post-commit)

在 Git 提交后执行：

```bash
#!/bin/bash
# .git/hooks/post-commit

# 推送代码到远程
git push

# 发送通知
curl -X POST "https://slack.webhook.url" \
  -d "{\"text\": \"新提交: $(git log -1 --oneline)\"}"
```

### 3. 消息前 Hook (pre-message)

在发送消息前执行（用于过滤或修改消息）：

```javascript
// pre-message.js
export function preMessageHook(message) {
  // 检查消息是否包含敏感词
  const sensitiveWords = ['password', 'secret', 'api_key']
  for (const word of sensitiveWords) {
    if (message.toLowerCase().includes(word)) {
      return {
        allowed: false,
        reason: `消息包含敏感词: ${word}`
      }
    }
  }
  return { allowed: true }
}
```

### 4. 消息后 Hook (post-message)

在消息发送后执行：

```javascript
// post-message.js
export function postMessageHook(response) {
  // 记录对话日志
  console.log(`[${new Date().toISOString()}] Response:`, response)

  // 提取代码片段保存
  extractCodeSnippets(response)

  // 更新统计
  updateMetrics(response)
}
```

## Claude Code 中的 Hooks

### 配置文件

在 `CLAUDE.md` 或 `.claude/hooks/` 中定义：

```markdown
# Claude Code Hooks 配置

[hooks]

## 每次操作前
pre-action: |
  echo "开始执行操作..."
  log_operation "$@"

## 每次操作后
post-action: |
  echo "操作完成"
  notify_completion

## 文件修改前
pre-edit: |
  # 备份原文件
  cp $file $file.bak

## 文件修改后
post-edit: |
  # 格式化代码
  prettier --write $file

## 危险操作确认
dangerous-confirm: |
  echo "⚠️ 确认执行: $operation"
  confirm_user
```

### 脚本 Hooks

创建可执行的脚本文件：

```bash
#!/bin/bash
# .claude/hooks/pre-commit.sh

echo "Running pre-commit checks..."

# ESLint
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi

# Type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed"
  exit 1
fi

# Unit tests
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✅ All checks passed"
exit 0
```

```bash
chmod +x .claude/hooks/pre-commit.sh
```

### Node.js Hooks

```javascript
// .claude/hooks/index.js

export const hooks = {
  // 每次执行命令前
  'command:before': async (command, args) => {
    console.log(`Executing: ${command} ${args.join(' ')}`)

    // 记录命令到审计日志
    await logCommand(command, args)

    return { continue: true }
  },

  // 每次执行命令后
  'command:after': async (command, args, result) => {
    if (result.exitCode !== 0) {
      // 发送错误通知
      await notifyError(command, result)
    }
  },

  // 文件读取前
  'file:read:before': async (filePath) => {
    // 检查文件是否存在
    if (!exists(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }
    return { continue: true }
  },

  // 文件写入前
  'file:write:before': async (filePath, content) => {
    // 备份现有文件
    if (exists(filePath)) {
      await backupFile(filePath)
    }

    // 检查内容大小
    if (content.length > 1_000_000) {
      throw new Error('File too large')
    }

    return { continue: true }
  },

  // 文件写入后
  'file:write:after': async (filePath, content) => {
    // 自动格式化
    await formatFile(filePath)

    // 更新文件索引
    await updateIndex(filePath)
  },

  // 会话开始
  'session:start': async (session) => {
    console.log(`Session started: ${session.id}`)
    await loadSessionContext(session)
  },

  // 会话结束
  'session:end': async (session) => {
    console.log(`Session ended: ${session.id}`)
    await saveSessionContext(session)
    await cleanupTempFiles()
  }
}
```

## 内置 Hooks

### Prettier Hook

自动格式化代码：

```bash
#!/bin/bash
# .claude/hooks/format.sh

npx prettier --write "$1"
```

### ESLint Hook

代码质量检查：

```bash
#!/bin/bash
# .claude/hooks/lint.sh

npx eslint "$1" --fix
```

### Test Hook

自动运行相关测试：

```bash
#!/bin/bash
# .claude/hooks/test.sh

# 找到相关的测试文件
TEST_FILE=$(find . -path "*/tests/*" -name "*$(basename $1 .ts)*.test.ts")

if [ -n "$TEST_FILE" ]; then
  npx vitest run $TEST_FILE
else
  echo "No related tests found"
fi
```

## Hook 脚本示例

### 1. 自动提交 Hook

```javascript
// .claude/hooks/auto-commit.js

export async function onFileChange(filePath) {
  // 检查是否是重要文件
  const importantFiles = [
    'src/**/*',
    'package.json',
    'tsconfig.json'
  ]

  const isImportant = importantFiles.some(pattern =>
    match(pattern, filePath)
  )

  if (isImportant) {
    // 自动暂存更改
    await exec(`git add ${filePath}`)

    // 尝试自动提交
    const message = generateCommitMessage(filePath)
    await exec(`git commit -m "${message}"`)

    console.log(`Auto-committed: ${message}`)
  }
}
```

### 2. 安全检查 Hook

```javascript
// .claude/hooks/security-check.js

export async function onFileWrite(filePath, content) {
  const securityIssues = []

  // 检查硬编码密钥
  const secrets = content.match(
    /(api[_-]?key|password|secret|token)\s*[=:]\s*['"][^'"]+['"]/gi
  )
  if (secrets) {
    securityIssues.push('发现可能的硬编码密钥')
  }

  // 检查 SQL 注入风险
  if (content.includes('SELECT') && content.includes('+ ')) {
    securityIssues.push('可能的 SQL 注入风险')
  }

  // 检查 XSS 风险
  if (content.includes('innerHTML') && !content.includes('sanitize')) {
    securityIssues.push('可能的 XSS 风险：使用 innerHTML 而无消毒')
  }

  if (securityIssues.length > 0) {
    console.warn('⚠️ 安全问题警告:')
    securityIssues.forEach(issue => console.warn(`  - ${issue}`))
  }
}
```

### 3. 性能监控 Hook

```javascript
// .claude/hooks/performance.js

export async function onCommandExecute(command, startTime) {
  const duration = Date.now() - startTime

  if (duration > 30000) { // 超过 30 秒
    console.log(`⚠️ 命令执行时间较长: ${command} (${duration}ms)`)
  }

  // 记录到性能日志
  await logPerformance({
    command,
    duration,
    timestamp: new Date().toISOString()
  })
}
```

## Hook 配置

### 在 settings.json 中配置

```json
{
  "hooks": {
    "enabled": true,
    "scripts": {
      "pre-commit": ".claude/hooks/pre-commit.sh",
      "post-commit": ".claude/hooks/post-commit.sh",
      "pre-edit": ".claude/hooks/pre-edit.sh",
      "post-edit": ".claude/hooks/post-edit.sh"
    },
    "permissions": {
      "allowDangerous": false,
      "confirmCommands": ["rm", "git reset", "git clean"]
    }
  }
}
```

### 在 CLAUDE.md 中配置

```markdown
[hooks]

## 启用 Hooks
enabled: true

## 权限设置
permissions:
  autoConfirm: false
  dangerousCommands: [rm -rf, git reset --hard]

## 超时设置
timeout:
  default: 30s
  critical: 5m
```

## Hook 执行顺序

```
1. pre-action hooks
         ↓
2. 权限检查
         ↓
3. pre-edit/pre-write hooks
         ↓
4. 执行实际操作
         ↓
5. post-edit/post-write hooks
         ↓
6. post-action hooks
         ↓
7. 通知 hooks
```

## Hook 权限系统

### 允许列表

```json
{
  "hooks": {
    "allowlist": {
      "pre-commit": {
        "scripts": ["npm run lint", "npm test"],
        "timeout": 60
      },
      "post-commit": {
        "scripts": ["git push"],
        "timeout": 30
      }
    }
  }
}
```

### 危险操作拦截

```bash
#!/bin/bash
# .claude/hooks/dangerous-check.sh

COMMAND=$1
DANGEROUS_PATTERNS=(
  "rm -rf"
  "git reset --hard"
  "drop table"
  "DELETE FROM.*WHERE"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if [[ $COMMAND =~ $pattern ]]; then
    echo "⚠️ 危险命令被拦截: $COMMAND"
    echo "如需执行，请使用 --force 选项"
    exit 1
  fi
done
```

## Hook 调试

### 调试模式

```bash
DEBUG=hooks:* claude
```

### 查看 Hook 日志

```bash
tail -f .claude/logs/hooks.log
```

### 测试 Hook

```bash
claude --test-hook pre-commit
```

## 常用 Hook 模板

### 1. CI/CD Hook

```yaml
# .claude/hooks/cicd.yml
hooks:
  post-commit:
    - name: Run CI
      script: |
        if [ "$BRANCH" = "main" ]; then
          trigger-ci-pipeline
        fi

  pre-push:
    - name: Security scan
      script: npm run security-scan
    - name: Build check
      script: npm run build
```

### 2. 开发环境 Hook

```yaml
# .claude/hooks/dev.yml
hooks:
  session:start:
    - name: Load dev tools
      script: |
        load-env development
        start-dev-server
        open-browser http://localhost:3000

  session:end:
    - name: Cleanup
      script: |
        stop-dev-server
        cleanup-logs
```

### 3. 文档生成 Hook

```yaml
# .claude/hooks/docs.yml
hooks:
  post-edit:
    - name: Update docs
      when:
        files:
          - 'src/**/*.md'
          - 'docs/**/*'
      script: |
        npm run docs:generate
        git add docs/
```

## 最佳实践

### 1. 保持简单

```
✅ 简单可靠的 Hook
✅ 快速执行
✅ 清晰的错误信息

❌ 过于复杂的 Hook
❌ 长时间运行的 Hook
```

### 2. 错误处理

```javascript
export async function safeHook(action) {
  try {
    await action()
  } catch (error) {
    console.error(`Hook error: ${error.message}`)
    // 不要阻止主流程
    return { success: false, error: error.message }
  }
}
```

### 3. 性能考虑

```javascript
// ❌ 同步阻塞
function slowHook() {
  sleep(5) // 阻塞 5 秒
}

// ✅ 异步非阻塞
async function fastHook() {
  // 异步执行
  await asyncOperation()
}
```

### 4. 安全第一

```
✅ 验证输入
✅ 限制权限
✅ 记录日志

❌ 执行任意命令
❌ 忽略错误
❌ 暴露敏感信息
```

## 常见问题

### Q: Hook 不执行？

A: 检查文件权限，确保脚本可执行：
```bash
chmod +x .claude/hooks/*.sh
```

### Q: Hook 超时？

A: 在配置中增加超时时间：
```json
{
  "hooks": {
    "timeout": 120
  }
}
```

### Q: 如何禁用某个 Hook？

```json
{
  "hooks": {
    "disabled": ["post-commit"]
  }
}
```

::: tip 进阶使用
Hooks 是实现自动化工作流的关键。善用 Hooks 可以大大提高开发效率，同时确保代码质量。
:::
