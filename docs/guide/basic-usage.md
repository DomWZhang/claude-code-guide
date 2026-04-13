# 基础使用：实战导向的工作流

本章从实际场景出发，系统讲解 Claude Code 的日常使用技巧、交互模式、文件操作、Git 集成和任务管理。

## 交互模式详解

### 启动与退出

```bash
# 在当前目录启动
claude

# 指定项目目录启动
claude --cwd /path/to/project

# 退出（两种方式）
/exit
/bye
```

### 两种执行模式对比

| 模式 | 命令 | 特点 | 适用场景 |
|------|------|------|----------|
| 交互模式 | `claude` | 持续对话，保留上下文 | 复杂任务、多轮迭代 |
| 单次模式 | `claude -p "prompt"` | 执行后退出，无状态 | 脚本集成、CI/CD |

**单次模式示例**：

```bash
# 解释代码
claude -p "解释 src/index.ts 中的 main 函数"

# 生成代码片段
claude -p "生成一个 React Hook useLocalStorage"

# 代码审查（输出到文件）
claude -p "审查 src/auth/login.ts" > review.txt
```

## 高效请求技巧

### 请求结构模板

一个高质量的请求应包含：**上下文 + 任务 + 约束 + 输出格式**。

```
[上下文] 这是一个 Next.js 14 + TypeScript 项目，使用 App Router。
[任务] 在 app/api/auth/route.ts 中实现 POST /api/auth 接口，
       接收 email 和 password，验证后返回 JWT token。
[约束] 使用 bcrypt 验证密码，zod 验证输入，
       错误时返回 401，成功返回 200。
[输出] 直接输出完整代码，不要解释。
```

### 请求示例对比

| 类型 | 请求 | Claude 行为 |
|------|------|-------------|
| ❌ 模糊 | "修复 bug" | 需要追问，浪费时间 |
| ✅ 清晰 | "修复 src/api/user.ts 中 getUserById 函数：当传入无效 ID 时应该返回 null 而不是抛出异常" | 直接定位并修复 |
| ✅ 带范围 | "修改 src/components/ 下所有 .js 文件为 .tsx，并添加类型定义" | 批量处理 |
| ✅ 带约束 | "重构这个函数，保持原有 API 签名不变，添加错误处理" | 生成兼容代码 |

### 使用文件引用

```
# 引用具体文件
分析 src/utils/helpers.ts 中的 formatDate 函数，指出性能问题

# 引用多个文件
对比 src/api/v1/ 和 src/api/v2/ 中的类型定义差异

# 引用目录
审查 src/hooks/ 下所有自定义 Hook 的实现质量
```

## 文件操作实战

### 读取文件

```
# 基本读取
读取 package.json

# 指定行范围
读取 src/app.ts 第 50-100 行

# 读取多个文件
同时读取 src/types/user.ts 和 src/types/post.ts

# 搜索式读取
找出所有 export default 的组件
```

### 创建和编辑

```
# 创建新文件
创建 src/utils/string.ts，包含 capitalize、truncate 函数

# 编辑现有文件
在 src/index.ts 的第 5 行后添加 console.log('start')

# 批量替换
将 src/components/ 下所有 Button 组件中的 variant='primary' 替换为 intent='primary'

# 重构
将 src/utils.ts 中的 getData 重命名为 fetchData，并更新所有引用
```

### 删除操作（需确认）

```
删除 src/temp/ 下的所有 .log 文件

⚠️ Claude Code 会要求确认：
> rm src/temp/*.log
是否继续？(yes/no)
```

## 终端命令执行

### 基本命令

```
# 包管理
安装 axios
运行 npm install
更新所有依赖到最新版本

# 构建与测试
运行 npm run build
执行 npm test -- --watch

# Git 操作（见下一节）
查看 git status
```

### 命令执行策略

| 命令类型 | 执行方式 | 需要确认 |
|----------|----------|----------|
| 只读命令（ls, cat, grep） | 自动执行 | 否 |
| 包管理（npm install, pip install） | 自动执行 | 否 |
| 构建测试（npm run build, pytest） | 自动执行 | 否 |
| 危险命令（rm -rf, git push --force） | 需确认 | 是 |
| 耗时命令（长时间运行的服务器） | 后台执行 | 需确认 |

### 处理长时间运行命令

```
# 启动开发服务器（后台运行）
npm run dev
# Claude Code 会在后台运行，你可以继续其他操作

# 查看后台任务
/tasks

# 停止后台任务
/task stop <task_id>
```

## Git 集成

### 基础操作

```
# 查看状态
查看 git status

# 暂存文件
git add src/ 添加到暂存区

# 提交
提交当前修改，信息为 "fix: 修复登录验证逻辑"

# 推送
git push origin main
```

### 分支管理

```
# 创建分支
创建新分支 feature/user-profile

# 切换分支
切换到 develop 分支

# 合并
将 feature/user-profile 合并到 main

# 删除分支
删除已合并的 feature/old-feature 分支
```

### 高级 Git 工作流

```
# 交互式 rebase
对最近 3 个提交进行 squash

# 解决冲突
解决当前分支与 main 的冲突

# 查看历史
查看最近的提交历史，找出谁修改了 src/auth.ts

# 创建 PR
创建 Pull Request，标题为 "feat: 添加用户系统"，描述为 "实现了用户注册、登录和资料编辑"
```

## 任务管理与规划

### 复杂任务分解

Claude Code 会自动将复杂任务分解为步骤，并在执行过程中显示进度。

**示例**："从零创建一个 Express + TypeScript 项目"

Claude 的规划：
```
1. 初始化 npm 项目
2. 安装依赖（express, typescript, @types/express, ts-node, nodemon）
3. 配置 tsconfig.json
4. 创建 src/index.ts 入口文件
5. 添加基础 Express 服务器代码
6. 配置 package.json scripts
7. 启动开发服务器验证
```

### 中途调整

```
# 跳过某一步
跳过步骤 3，直接创建入口文件

# 修改计划
在步骤 2 中添加 dotenv 依赖

# 回退
取消刚才的修改，回到之前的状态
```

### 使用 TodoWrite 跟踪

Claude Code 会自动使用 `TodoWrite` 工具管理任务列表，你可以随时查看进度：

```
当前任务列表：
- [✓] 分析需求
- [→] 设计方案
- [ ] 编写代码
- [ ] 测试验证
```

## 会话管理

### 上下文查看

```
# 查看当前会话信息
/info

# 查看成本
/cost

# 查看已加载的文件列表
/files
```

### 会话操作

| 命令 | 作用 | 使用时机 |
|------|------|----------|
| `/clear` | 清空所有历史 | 开始全新任务 |
| `/compact` | 压缩上下文，保留关键信息 | 任务里程碑 |
| `/sessions` | 查看历史会话 | 回顾之前工作 |
| `/resume <id>` | 恢复之前的会话 | 继续未完成任务 |

### 会话恢复示例

```bash
# 列出所有会话
/sessions

# 输出示例：
# 2024-01-15 10:30: auth-feature (成本 $0.23)
# 2024-01-14 16:20: bug-fix (成本 $0.08)

# 恢复会话
/resume auth-feature
```

## 模型切换

### 手动切换

```
# 切换到 Sonnet（默认，性价比最高）
/model sonnet

# 切换到 Opus（复杂推理任务）
/model opus

# 切换到 Haiku（简单任务，最便宜）
/model haiku
```

### 模型选择建议

| 任务类型 | 推荐模型 | 原因 |
|----------|----------|------|
| 简单代码生成 | Haiku | 成本最低，速度快 |
| 日常开发 | Sonnet | 平衡质量与成本 |
| 架构设计、复杂重构 | Opus | 深度推理能力 |
| 代码审查 | Haiku/Sonnet | 根据代码复杂度选择 |
| 文档生成 | Haiku | 简单任务 |

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + C` | 取消当前操作 |
| `Ctrl + D` | 退出 Claude Code |
| `Ctrl + L` | 清屏 |
| `↑ / ↓` | 浏览历史命令 |
| `Tab` | 自动补全命令 |

## 常见问题排查

### Claude 不理解需求

```
# 提供更多上下文
当前项目使用 React 18 和 TypeScript 5，
我的需求是...

# 分步引导
第一步：先分析当前代码
第二步：再提出方案
```

### 操作被拒绝

```
# 查看拒绝原因
Claude Code 会显示原因，如：
- 需要确认危险操作
- 文件路径不存在
- 权限不足

# 调整后重试
使用更明确的文件路径，或确认操作
```

### 上下文过大

```
# 手动压缩
/compact

# 清空重置
/clear

# 调整自动压缩阈值
在 settings.json 中设置 CLAUDE_AUTOCOMPACT_PCT_OVERRIDE
```

## 最佳实践总结

1. **明确范围**：始终指定要操作的文件或目录
2. **分步执行**：复杂任务拆解为多个简单请求
3. **利用上下文**：引用之前的对话内容
4. **及时压缩**：任务里程碑处执行 `/compact`
5. **成本意识**：默认使用 Sonnet，简单任务用 Haiku
6. **会话管理**：不同任务使用不同会话，避免混淆

::: tip
掌握基础使用后，建议阅读 [核心概念](/guide/concepts) 理解底层原理，以及 [性能优化](/guide/advanced/performance) 控制使用成本。
:::
