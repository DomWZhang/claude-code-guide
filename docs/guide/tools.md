# 工具列表

Claude Code 提供了丰富的内置工具，用于与文件系统、Git、Shell 等交互。

## 工具概览

```
┌─────────────────────────────────────────────────────┐
│                   Claude Code                        │
├─────────────────────────────────────────────────────┤
│  📁 文件工具    │  🔧 Shell 工具  │  🔍 搜索工具    │
│  Read          │  Bash          │  Grep           │
│  Write         │  Exec          │  Glob           │
│  Edit          │  Spawn         │  GrepContext    │
│  Glob          │                │                 │
├─────────────────────────────────────────────────────┤
│  🔀 Git 工具    │  🌐 网络工具    │  📊 数据工具    │
│  GitStatus     │  WebFetch      │  TodoList      │
│  GitLog        │  WebSearch     │  NotebookEdit  │
│  GitDiff       │                │                 │
│  GitBranch     │                │                 │
└─────────────────────────────────────────────────────┘
```

## 文件系统工具

### 1. Read - 读取文件

**功能**: 读取文件内容

**签名**:
```typescript
Read(file_path: string, limit?: number, offset?: number)
```

**示例**:
```
读取 /src/app.ts 的前 100 行
```

```typescript
// 读取整个文件
Read({ file_path: "/src/index.ts" })

// 读取指定行范围
Read({ file_path: "/src/app.ts", limit: 100, offset: 0 })

// 读取 PDF
Read({ file_path: "/docs/guide.pdf", pages: "1-5" })

// 读取图片
Read({ file_path: "/assets/logo.png" })
```

**参数说明**:
- `file_path`: 文件路径（绝对或相对路径）
- `limit`: 最大行数
- `offset`: 起始行号

### 2. Write - 写入文件

**功能**: 创建或覆盖文件

**签名**:
```typescript
Write(file_path: string, content: string)
```

**示例**:
```
创建 src/types/user.ts
```

```typescript
Write({
  file_path: "/src/types/user.ts",
  content: `export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export interface UserProfile extends User {
  bio: string
  avatar: string
}
`
})
```

**注意**: 会覆盖现有文件！

### 3. Edit - 编辑文件

**功能**: 对文件进行精确编辑

**签名**:
```typescript
Edit(file_path: string, old_string: string, new_string: string)
```

**示例**:
```
编辑 src/utils.ts，将 getData 改名为 fetchData
```

```typescript
Edit({
  file_path: "/src/utils.ts",
  old_string: "function getData() {",
  new_string: "function fetchData() {"
})
```

**多行编辑**:
```typescript
Edit({
  file_path: "/src/app.ts",
  old_string: `function oldFunction() {
  console.log("old")
  return null
}`,
  new_string: `function newFunction() {
  console.log("new")
  return { success: true }
}`
})
```

### 4. Glob - 文件搜索

**功能**: 搜索匹配的文件

**签名**:
```typescript
Glob(pattern: string, options?: { path?: string })
```

**示例**:
```
找出 src 下所有 TypeScript 文件
```

```typescript
Glob({ pattern: "src/**/*.ts" })
Glob({ pattern: "src/**/*.tsx" })
Glob({ pattern: "**/*.test.ts" })
Glob({ pattern: "**/*.json", path: "/config" })
```

**常用模式**:
- `*` - 匹配任意字符（不含目录分隔符）
- `**` - 匹配任意字符（含目录分隔符）
- `?` - 匹配单个字符
- `[abc]` - 匹配字符集合

### 5. Bash - 执行命令

**功能**: 执行 Shell 命令

**签名**:
```typescript
Bash(command: string, options?: { timeout?: number })
```

**示例**:
```
运行 npm install
```

```typescript
Bash({ command: "npm install" })
Bash({ command: "git status" })
Bash({ command: "npm run build", timeout: 300 })
Bash({ command: "find . -name '*.tmp' -delete" })
```

**常用命令**:
```typescript
// 包管理
Bash({ command: "npm install" })
Bash({ command: "pnpm add react" })
Bash({ command: "yarn add -D typescript" })

// Git
Bash({ command: "git status" })
Bash({ command: "git log --oneline -10" })
Bash({ command: "git diff" })

// 文件操作
Bash({ command: "mkdir -p src/components" })
Bash({ command: "rm -rf dist" })
Bash({ command: "cp source.js dest.js" })

// 开发
Bash({ command: "npm run dev" })
Bash({ command: "npm test" })
Bash({ command: "npm run build" })
```

### 6. Grep - 内容搜索

**功能**: 在文件中搜索文本

**签名**:
```typescript
Grep(pattern: string, options?: {
  path?: string
  context?: number
  output_mode?: "content" | "files_with_matches"
})
```

**示例**:
```
在 src 目录搜索 useState
```

```typescript
Grep({
  pattern: "useState",
  path: "src",
  output_mode: "content"
})

// 搜索并显示上下文
Grep({
  pattern: "TODO",
  path: "src",
  context: 3,
  output_mode: "content"
})

// 只返回文件名
Grep({
  pattern: "React.memo",
  path: "src",
  output_mode: "files_with_matches"
})
```

**正则搜索**:
```typescript
Grep({
  pattern: "\\d{3}-\\d{4}",  // 匹配电话号码
  path: "src",
  output_mode: "content"
})
```

## Git 工具

### 7. GitStatus - Git 状态

```typescript
GitStatus()
```

**示例**:
```
查看当前 Git 状态
```

```typescript
GitStatus()
```

**输出**:
```
On branch main
Changes not staged for commit:
  modified:   src/app.ts
  modified:   src/utils.ts
Untracked files:
  src/new-file.ts
```

### 8. GitLog - Git 历史

```typescript
GitLog({ path?: string, max?: number })
```

**示例**:
```
查看最近的 10 条提交记录
```

```typescript
GitLog({ max: 10 })
GitLog({ path: "src/app.ts", max: 5 })
```

### 9. GitDiff - 文件差异

```typescript
GitDiff({ file?: string, staged?: boolean })
```

**示例**:
```
查看当前修改的差异
```

```typescript
GitDiff()
GitDiff({ file: "src/app.ts" })
GitDiff({ staged: true })
```

### 10. GitBranch - 分支管理

```typescript
GitBranch(options?: { create?: string, delete?: string })
```

**示例**:
```typescript
GitBranch()  // 列出所有分支
GitBranch({ create: "feature/new-feature" })
GitBranch({ delete: "feature/old-feature" })
```

## 网络工具

### 11. WebFetch - 获取网页

**功能**: 获取并分析网页内容

**签名**:
```typescript
WebFetch(url: string, prompt?: string)
```

**示例**:
```
获取 React 官方文档
```

```typescript
WebFetch({
  url: "https://react.dev",
  prompt: "提取文档中关于 Hooks 的介绍"
})
```

### 12. WebSearch - 网络搜索

**功能**: 搜索网络信息

**签名**:
```typescript
WebSearch(query: string, options?: { numResults?: number })
```

**示例**:
```
搜索最新的 React 文档
```

```typescript
WebSearch({ query: "React 18 new features 2024" })
WebSearch({ query: "TypeScript 5 tutorial", numResults: 5 })
```

## 代码工具

### 13. TodoWrite - 任务管理

```typescript
TodoWrite(operations: {
  create?: { subject: string, description?: string }[],
  update?: { taskId: string, status: "in_progress" | "completed" }[],
  delete?: { taskId: string }[]
})
```

**示例**:
```typescript
TodoWrite({
  create: [
    { subject: "实现用户登录功能", description: "使用 JWT 认证" },
    { subject: "编写单元测试" }
  ]
})

TodoWrite({
  update: [{ taskId: "1", status: "completed" }]
})
```

### 14. TodoList - 查看任务

```typescript
TodoList()
```

**示例**:
```typescript
TodoList()
```

## MCP 工具

通过 MCP 协议连接的工具，可以在配置中启用。

### 常用 MCP 工具

| MCP Server | 工具 | 说明 |
|------------|------|------|
| filesystem | read_file, write_file, list_directory | 文件操作 |
| github | get_repository, create_issue, create_pr | GitHub 操作 |
| postgres | query, execute, list_tables | 数据库操作 |
| slack | post_message, list_channels | Slack 通知 |

## 工具权限

### 配置文件

```json
{
  "tools": {
    "Bash": {
      "allowedCommands": ["npm *", "git *", "pnpm *"],
      "deniedCommands": ["rm -rf /*", "dd *"]
    },
    "Write": {
      "allowedPaths": ["src/**", "tests/**"],
      "deniedPaths": ["**/node_modules/**"]
    }
  }
}
```

## 工具使用技巧

### 1. 组合使用

```typescript
// 读取多个文件
Read({ file_path: "/src/a.ts" })
Read({ file_path: "/src/b.ts" })
Read({ file_path: "/src/c.ts" })

// 搜索并读取
Grep({ pattern: "TODO", output_mode: "files_with_matches" })
Read({ file_path: "src/todo-file.ts" })
```

### 2. 批量操作

```typescript
// 批量读取
Read({ file_path: "src/component-a.ts" })
Read({ file_path: "src/component-b.ts" })
Read({ file_path: "src/component-c.ts" })

// 批量编辑
Edit({ file_path: "src/a.ts", old: "a", new: "b" })
Edit({ file_path: "src/b.ts", old: "a", new: "b" })
```

### 3. 错误处理

```typescript
// 检查文件是否存在
Glob({ pattern: "src/**/*.ts" })

// 安全的文件操作
try {
  Read({ file_path: "potentially-missing.ts" })
} catch (error) {
  console.log("文件不存在，可能需要先创建")
}
```

### 4. 性能优化

```typescript
// ❌ 低效
Read({ file_path: "file1.ts" })
Read({ file_path: "file2.ts" })
Read({ file_path: "file3.ts" })

// ✅ 高效 - 一次读取多个
Read({ file_path: "file1.ts" })
Read({ file_path: "file2.ts" })
Read({ file_path: "file3.ts" })
// Claude 会智能并行调用
```

## 工具日志

查看工具调用记录：

```
/logs tools
```

## 常见问题

### Q: 工具调用失败？

A: 检查错误信息，确保：
- 文件路径正确
- 权限足够
- 命令语法正确

### Q: 工具权限不足？

A: 在 `settings.json` 中配置允许的工具和路径。

### Q: 如何禁用某个工具？

```json
{
  "tools": {
    "Bash": { "enabled": false }
  }
}
```

::: tip 高效使用
熟悉每个工具的能力，组合使用可以完成复杂的任务。善用 Glob 和 Grep 进行高效搜索。
:::
