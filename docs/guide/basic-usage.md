# 基础使用

本指南覆盖 Claude Code 日常使用中最常见的操作模式：文件操作、Git 管理、会话控制等。所有操作均通过自然语言交互，无需记忆复杂命令。

## 启动与退出

### 交互模式

```bash
# 在项目目录中启动
cd /path/to/project
claude

# 指定 Agent 启动
claude --agent Explore

# 指定模型启动
claude --model sonnet

# 指定任务投入程度
claude --effort high
```

### 单次执行模式

```bash
# 执行单个任务后退出
claude -p "解释 src/auth/login.ts 中的登录逻辑"

# 指定输出格式
claude -p --output-format json "获取 users 表结构"

# 带预算限制
claude -p --max-budget-usd 0.05 "生成一个 React useLocalStorage Hook"

# 结构化输出
claude -p --json-schema '{"type":"object","properties":{"name":{"type":"string"}}}' \
  "返回一个用户对象"
```

### 退出交互会话

输入 `/exit` 或直接按 `Ctrl+C`。

## 文件操作

Claude Code 的文件操作通过**自然语言**描述，Claude 自动调用相应工具。

### 读取文件

```
读取 src/app.ts 的全部内容
```

```
读取 src/app.ts 的前 100 行
```

```
读取 docs/guide.md 的第 50-100 行
```

```
列出 src/components 目录下的所有 .vue 文件
```

```
搜索 src 中包含 "useAuth" 的所有文件
```

### 写入文件

```
创建 src/utils/formatDate.ts
包含：
- formatDate(date: Date): string - 返回 YYYY-MM-DD
- formatDateTime(date: Date): string - 返回 YYYY-MM-DD HH:mm:ss
```

Claude 会创建文件并写入内容。**注意**：`Write` 操作会覆盖现有文件。

### 编辑文件

```
在 src/app.ts 的 handleSubmit 函数中添加参数校验
```

```
将 src/config.ts 中的 API_URL 改为 https://api.example.com/v2
```

Claude 使用精确字符串匹配进行编辑，确保只修改指定内容。

### 多文件协作

```
修改 src/auth/ 下的所有文件，将 User 类型导入改为从 @/types 导入
```

### 批量文件操作

```
将 src/pages 下的所有函数组件改为箭头函数形式
```

## Git 操作

### 查看状态

```
查看当前的 git 状态
```

```
查看最近的 5 次提交
```

```
查看当前分支与 main 分支的差异
```

### 提交更改

```
提交当前的修改，提交信息为 "feat: 添加用户认证功能"
```

```
将 src/ 下的所有修改添加到暂存区并提交
```

```
先查看 diff，然后提交
```

### 分支管理

```
创建并切换到新分支 feat/user-auth
```

```
查看所有远程分支
```

```
将当前分支合并到 main
```

### 查看历史

```
查看 src/app.ts 的提交历史
```

```
查看某个特定提交的修改内容
```

### 与 PR 协作

```bash
# 从 PR 恢复会话（交互式选择）
claude --from-pr

# 指定 PR 编号
claude --from-pr 123

# 指定 PR URL
claude --from-pr https://github.com/owner/repo/pull/456
```

## Shell 命令执行

Claude Code 内置 Bash 工具，可以直接执行 Shell 命令：

```
运行 npm test 检查测试是否通过
```

```
执行 npm run build 构建项目
```

```
运行 TypeScript 类型检查
npx tsc --noEmit
```

```
启动开发服务器
npm run dev
```

```
执行数据库迁移
npm run db:migrate
```

### 权限分级

| 操作类型 | 权限要求 | 示例 |
|----------|----------|------|
| 只读操作 | 自动执行 | `cat`, `ls`, `grep` |
| 读操作（修改状态） | 自动执行 | `git status` |
| 修改文件 | 需确认 | `echo > file`, `mv` |
| 破坏性操作 | 明确确认 | `rm -rf`, `git reset --hard` |
| 危险操作 | 需明确授权 | 网络请求、凭据操作 |

### 执行权限模式

```bash
# 默认模式（危险操作需确认）
claude

# 自动接受所有编辑
claude --permission-mode acceptEdits

# 跳过所有权限检查（危险！）
claude --dangerously-skip-permissions

# 仅计划模式（不执行实际操作）
claude --permission-mode plan
```

## 会话管理

### 继续最近会话

```bash
claude -c
# 或
claude --continue
```

### 恢复指定会话

```bash
# 交互式选择（显示会话列表）
claude -r

# 指定会话名称
claude -r auth-feature

# 指定会话 UUID
claude --session-id a74067fd-f453-454e-a66d-b4f86200b172

# 恢复时创建新会话（不覆盖原会话）
claude --resume --fork-session
```

### 查看会话成本

```
/cost
```

```
在会话中输入 /cost 查看当前会话的 API 成本和 Token 统计
```

### 压缩上下文

```
/compact
```

在关键里程碑处执行 `/compact`，可保留关键上下文同时压缩旧对话，防止超出 Token 限制。

### 重置会话

```
/clear
```

完全清空当前会话上下文，重新开始。

## Slash 命令参考

Slash 命令是在交互式会话中快速执行特定操作的快捷方式。

### 已验证的命令

| 命令 | 功能 | 示例 |
|------|------|------|
| `/cost` | 显示当前会话的 API 成本和 Token 使用统计 | `/cost` |
| `/compact` | 压缩上下文，保留关键信息 | `/compact` |
| `/model <model>` | 切换当前会话的模型 | `/model sonnet` |
| `/agent <name>` | 切换当前会话的 Agent | `/agent review` |

### 会话控制命令

| 命令 | 功能 |
|------|------|
| `/clear` | 清空会话上下文，重新开始 |
| `/exit` | 退出当前会话 |
| `/new` | 开始新会话（保留当前） |

### 任务命令

| 命令 | 功能 |
|------|------|
| `/plan` | 进入计划模式，分析任务并制定步骤 |
| `/test` | 运行测试 |
| `/commit` | 提交当前更改 |
| `/simplify` | 简化代码 |
| `/review-pr` | 审查 Pull Request |

### 集成命令

| 命令 | 功能 |
|------|------|
| `/web-search` | 执行网络搜索 |
| `/loop` | 设置循环任务 |
| `/fast` | 启用快速模式 |
| `/memory` | 管理记忆 |

> **注意**：部分 slash 命令可能需要对应的插件或配置。首次使用陌生命令时，留意 Claude 的反馈。

## 输出控制

### 模型切换

```bash
# 会话中切换
/model sonnet    # 使用 Sonnet 4
/model opus      # 使用 Opus 4
/model haiku     # 使用 Haiku 4

# 命令行指定
claude --model sonnet
```

### 输出格式

```bash
# 纯文本（默认）
claude -p "解释这段代码"

# JSON 格式
claude -p --output-format json "返回用户对象"

# 流式 JSON（实时输出）
claude -p --output-format stream-json "实现一个函数"
```

### 结构化输出

```bash
# 使用 JSON Schema 验证输出
claude -p --json-schema '{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" }
  },
  "required": ["name"]
}' "返回一个用户对象"
```

## 管道与脚本集成

### 管道输入

```bash
# 将代码通过管道传给 Claude
cat src/utils.ts | claude -p "审查这段代码的质量"

# 将 Diff 传给 Claude
git diff | claude -p "审查这些代码变更"

# 将测试输出传给 Claude
npm test 2>&1 | claude -p "分析这些测试失败的原因"
```

### 脚本集成

```bash
#!/bin/bash
# 自动化代码审查脚本

echo "=== Claude Code 自动化审查 ==="
echo ""

# 审查 PR diff
git fetch origin main
git diff origin/main...HEAD > /tmp/pr.diff

claude -p --output-format json "审查以下 diff，识别潜在问题：
$(cat /tmp/pr.diff)" > /tmp/review.json

echo "审查完成，结果保存在 /tmp/review.json"
```

### CI/CD 集成

```bash
# 在 CI 中运行 Claude
claude -p \
  --permission-mode acceptEdits \
  --no-session-persistence \
  --max-budget-usd 0.10 \
  "运行测试并修复失败的用例"
```

## 工具使用策略

### 何时描述，何时指定

```
✅ 描述意图（推荐）：
  "给这个组件添加 loading 状态"

✅ 指定操作：
  "在 src/components/Button.tsx 的第 20 行后添加：
  const [loading, setLoading] = useState(false);"

✅ 指定文件+意图：
  "修改 src/api/users.ts，使用 fetch 替代 axios"
```

### 读取 vs 修改

```
读取操作：描述想看什么
  "查看 src/auth 的目录结构"
  "找到 src 中处理文件上传的所有代码"
  "查看 package.json 中的依赖"

修改操作：描述期望结果
  "将所有 .js 文件重命名为 .ts"
  "给 UserService 类添加 getUserById 方法"
```

### 错误处理

```
这个修改导致了 TypeScript 错误，请修复
```

```
运行 tsc --noEmit 看看有什么错误
```

```
上一条命令报错了，错误信息是：...
```

## 常见工作流

### 工作流 1：实现新功能

```
1. 启动 Claude：
   claude

2. 描述需求：
   "实现用户注册功能，包含邮箱验证和密码强度校验"

3. Claude 规划并实现

4. 测试：
   "运行测试确认功能正常"

5. 提交：
   "提交这些更改"
```

### 工作流 2：代码重构

```
1. claude --effort high
   （重构需要高投入）

2. "分析当前 src/api/ 目录的代码结构，找出重复模式"

3. 根据分析结果：
   "将重复的 API 调用抽象为通用 Hook"

4. 验证：
   "运行所有测试确认重构没有破坏功能"

5. 审查：
   "执行 /simplify 简化生成的代码"
```

### 工作流 3：Bug 修复

```
1. claude -c
   （继续之前的会话，或开启新会话）

2. "修复 src/utils/date.ts 中的时区问题"

3. "先复现问题：运行 npm test -- --grep timezone"

4. 根据测试结果：
   "问题已定位，在 formatDate 函数中缺少时区转换"

5. 修复后验证：
   "再次运行测试确认修复有效"
```

### 工作流 4：Code Review

```bash
# 从 PR 启动
claude --from-pr 123 --agent review

# 或启动审查 Agent
claude --agents '{
  "review": {
    "description": "代码审查",
    "prompt": "你是代码审查专家..."
  }
}' --agent review

# 然后描述审查范围
请审查 src/auth/ 目录下所有文件的代码质量
```

## MCP 工具使用

如果已配置 MCP 服务器，可以直接使用外部服务：

```
使用 GitHub MCP 创建 Issue：
标题：优化 API 响应时间
标签：performance, enhancement
```

```
使用 Postgres MCP 查询数据：
SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'
```

详见 [MCP 集成](/guide/mcp) 章节。
