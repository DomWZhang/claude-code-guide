# 工具系统

Claude Code 的工具系统是其与外部环境交互的核心机制。理解工具的工作原理，有助于你更精确地控制 Claude 的行为。

## 工具概览

Claude Code 内置的工具分为以下几类：

```
┌────────────────────────────────────────────────────────────┐
│                     内置工具                                 │
├──────────────────┬─────────────────┬───────────────────────┤
│  📁 文件操作     │  🔧 Shell 命令   │  🔍 搜索与查找        │
│  Read            │  Bash           │  Grep                 │
│  Write           │                 │  Glob                 │
│  Edit            │                 │                       │
├──────────────────┼─────────────────┼───────────────────────┤
│  ✏️ 任务管理     │  🌐 网络工具     │  📓 特殊工具          │
│  TodoWrite       │  WebSearch      │  NotebookEdit         │
│  AskUserQuestion │  WebFetch       │  ScheduleWakeup       │
│                  │                 │  TaskStop             │
│                  │                 │  TaskOutput           │
└──────────────────┴─────────────────┴───────────────────────┘
```

## 文件操作工具

### Read — 读取文件

**功能**：读取文件内容，支持行范围选择

```json
Read({
  file_path: string,
  limit?: number,
  offset?: number
})
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `file_path` | string | 文件路径（绝对或相对） |
| `limit` | number | 最多读取的行数 |
| `offset` | number | 起始行号（0 为文件开头） |

**使用示例**：

```
读取 src/app.ts 的前 100 行
读取 src/app.ts 的第 50-100 行
读取 src/app.ts 全部内容
```

Claude Code 也能处理图片和 PDF：

```
读取 /docs/screenshot.png
读取 /docs/guide.pdf 的第 1-10 页
```

### Write — 写入文件

**功能**：创建新文件或覆盖现有文件

```json
Write({
  file_path: string,
  content: string
})
```

**使用示例**：

```
创建 src/types/user.ts
```

Claude 会提示文件不存在，确认后创建。

**⚠️ 注意**：`Write` 会覆盖现有文件！编辑现有文件请使用 `Edit`。

### Edit — 编辑文件

**功能**：精确替换文件中的特定文本

```json
Edit({
  file_path: string,
  old_string: string,
  new_string: string
})
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `file_path` | string | 文件路径 |
| `old_string` | string | 要替换的原文（必须精确匹配） |
| `new_string` | string | 替换后的新文本 |

**使用示例**：

```
将 src/config.ts 中的 API_URL 改为 https://api.example.com/v2
```

```
在 src/app.ts 的 handleSubmit 函数末尾添加错误处理
```

**使用技巧**：
- `old_string` 必须精确匹配，包括缩进和换行
- 如果文件中有多处相同内容，提供更多上下文
- 优先匹配唯一性高的片段

### Glob — 模式匹配

**功能**：按模式查找文件

```json
Glob({
  pattern: string,
  path?: string
})
```

**使用示例**：

```
列出 src/components 目录下的所有 .vue 文件
```

```
查找项目中所有的 test 文件
```

```
找到 src 目录下包含 "useAuth" 的文件
```

### Grep — 内容搜索

**功能**：在文件中搜索匹配的内容

```json
Grep({
  pattern: string,
  path?: string,
  output_mode?: "content" | "files_with_matches" | "count"
})
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `pattern` | string | 正则表达式或普通字符串 |
| `path` | string | 搜索路径 |
| `output_mode` | string | 输出模式 |

**使用示例**：

```
搜索 src 中所有包含 "TODO" 的行
```

```
找到所有使用 useState 的 React 组件
```

```
统计 src/components 目录下 .tsx 文件数量
```

## Shell 工具

### Bash — 执行 Shell 命令

**功能**：在终端执行任意 Shell 命令

```json
Bash({
  command: string,
  timeout?: number,
  description?: string
})
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `command` | string | 要执行的命令 |
| `timeout` | number | 超时时间（毫秒） |
| `description` | string | 命令描述（可选） |

**使用示例**：

```
运行 npm test 检查测试是否通过
```

```
执行 npm run build 构建项目
```

```
运行 TypeScript 类型检查：npx tsc --noEmit
```

**安全机制**：Claude Code 对危险命令（如 `rm -rf`、`dd`）有内置警告。

## 网络工具

### WebSearch — 网络搜索

**功能**：执行网络搜索

```json
WebSearch({
  query: string
})
```

**使用示例**：

```
搜索 "React 18 concurrent mode" 相关信息
```

```
搜索最新的 TypeScript 5.x 新特性
```

### WebFetch — 抓取网页

**功能**：获取并分析网页内容

```json
WebFetch({
  url: string,
  prompt?: string
})
```

**使用示例**：

```
获取 https://docs.anthropic.com 的内容并总结
```

```
读取 https://github.com/anthropic/claude-code 的 README
```

## 任务管理工具

### TodoWrite — 任务列表

**功能**：创建和管理任务列表

```json
TodoWrite({
  todos: Array<{
    activeForm: string,
    content: string,
    status: "in_progress" | "completed" | "pending"
  }>
})
```

**使用示例**：

```
用 TodoWrite 创建以下任务列表：
1. 分析数据库 schema
2. 设计 API 路由
3. 实现 CRUD 接口
4. 编写测试
5. 编写 API 文档
```

Claude 会自动使用 TodoWrite 跟踪复杂任务的进度。

### AskUserQuestion — 向用户提问

**功能**：在需要用户输入时暂停执行

```json
AskUserQuestion({
  questions: Array<{
    header: string,
    question: string,
    options: Array<{ label: string, description?: string }>,
    multiSelect?: boolean
  }>
})
```

**使用示例**：

当 Claude 需要用户选择时，会使用此工具暂停并显示选项。

## 特殊工具

### NotebookEdit — Jupyter Notebook 编辑

**功能**：编辑 `.ipynb` Jupyter Notebook 文件

```json
NotebookEdit({
  notebook_path: string,
  cell_id?: string,
  new_source?: string,
  edit_mode?: "replace" | "insert" | "delete",
  cell_type?: "code" | "markdown"
})
```

### ScheduleWakeup — 定时唤醒

**功能**：设置定时任务提醒

```json
ScheduleWakeup({
  delaySeconds: number,
  prompt: string,
  reason?: string
})
```

### TaskStop — 停止后台任务

**功能**：停止正在运行的后台任务

```json
TaskStop({
  task_id: string
})
```

### TaskOutput — 获取任务输出

**功能**：获取后台任务的执行结果

```json
TaskOutput({
  task_id: string,
  block?: boolean,
  timeout?: number
})
```

## 工具调用权限

### 权限级别

| 级别 | 工具 | 行为 |
|------|------|------|
| **只读** | Read, Glob, Grep, WebSearch, WebFetch | 自动执行，无需确认 |
| **信息获取** | Bash(git status, ls, cat) | 自动执行 |
| **修改文件** | Write, Edit, Bash(> file) | 需要确认 |
| **执行命令** | Bash(npm, git, etc.) | 需要确认 |
| **危险操作** | Bash(rm, dd, etc.) | 明确警告 |

### 控制工具权限

```bash
# 仅允许读操作
claude --allowedTools "Read,Glob,Grep"

# 禁止使用 Bash
claude --disallowedTools "Bash"

# 仅允许默认工具集
claude --tools default

# 禁用所有工具
claude --tools ""
```

### 权限提示示例

当 Claude 尝试执行需要确认的操作时，会显示：

```
⚠️ 确认操作

Bash: rm -rf node_modules/
是否执行？[确认] [拒绝]
```

## 工具与 MCP

MCP 扩展的工具会添加到工具列表中。查看当前可用的 MCP 工具：

```
列出当前会话中所有可用的工具
```

## 常见问题

### Q: Read 工具的 limit 和 offset 是必填的吗？

不是。省略两者会读取整个文件。

### Q: Edit 和 Write 的区别是什么？

- **Edit**：精确替换文件中的部分内容，不影响其他内容
- **Write**：创建新文件或完全覆盖现有文件

### Q: 如何让 Claude 只做读取操作？

```bash
claude --disallowedTools "Write,Edit,Bash"
```

### Q: 工具调用有超时限制吗？

`Bash` 支持 `timeout` 参数（毫秒）。默认超时取决于操作类型：

| 操作类型 | 默认超时 |
|----------|----------|
| 文件读取 | 30s |
| 文件写入 | 30s |
| Shell 命令 | 120s（可自定义） |
| Web 请求 | 60s |

### Q: Claude 如何选择调用哪个工具？

Claude 的工具选择基于：
1. **任务需求**：需要什么操作
2. **工具能力**：每个工具能做什么
3. **权限状态**：哪些工具有执行权限
4. **效率**：最优的操作序列

你可以通过精确描述来引导工具选择：

```
✅ "将 src/a.ts 的 handleClick 函数重命名为 onClick"
✅ "运行 npm test 验证功能"
❌ "修复这个 bug"（过于笼统）
```
