# Memory 系统

Claude Code 的 Memory 系统让你能够跨会话记住项目上下文、用户偏好和重要信息。

## Memory 概述

Claude Code 有两级记忆系统：

```
┌─────────────────────────────────────────────────────┐
│                   Session Memory                     │
│            (当前会话有效，退出后清除)                  │
└─────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────┐
│                  Persistent Memory                   │
│            (持久化，跨会话有效)                      │
└─────────────────────────────────────────────────────┘
```

## 记忆类型

### 1. 会话记忆 (Session Memory)

当前会话内的上下文：

```
启动 Claude Code
    ↓
加载 CLAUDE.md
    ↓
加载项目文件
    ↓
对话积累上下文
    ↓
退出 Claude Code
    ↓
会话结束，上下文清除
```

### 2. 项目记忆 (Project Memory)

持久化在 `.claude/` 目录：

```
~/.claude/
├── memory/           # 全局记忆
├── projects/         # 项目记忆
│   └── my-project/
│       ├── context.md
│       ├── preferences.md
│       └── history.md
└── mcp.json         # MCP 配置
```

### 3. 用户记忆 (User Memory)

存储在用户目录：

```
~/.claude/memory/
├── user.md          # 用户偏好
├── expertise.md     # 技术栈偏好
└── patterns.md      # 代码模式偏好
```

## 使用 Memory

### 自动记忆

Claude Code 自动记住：

- 项目结构
- 技术栈
- 代码风格
- 最近的修改
- 解决过的问题

### 手动记忆

```
记住：此项目使用 pnpm 作为包管理器
```

```
记住：用户偏好中文回复
```

```
记住：这个模块的测试文件放在 __tests__ 目录下
```

### 记忆查询

```
之前记住的这个项目的数据库配置是什么？
```

```
我的代码风格偏好是什么？
```

## Memory 文件结构

### 项目记忆目录

```
.claude/
└── memory/
    ├── project-overview.md    # 项目概述
    ├── architecture.md       # 架构说明
    ├── conventions.md        # 约定俗成
    ├── decisions.md          # 技术决策记录
    └── progress.md           # 开发进度
```

### 示例文件

#### project-overview.md

```markdown
# 项目概述

## 基本信息
- 项目名称: MyProject
- 描述: 一个现代化的 Web 应用
- 启动日期: 2024-01-15

## 团队成员
- 张三 (前端)
- 李四 (后端)
- 王五 (DevOps)

## 当前阶段
- 开发阶段: Beta 测试
- 目标上线日期: 2024-03-01
```

#### conventions.md

```markdown
# 项目约定

## 代码约定
- TypeScript 严格模式
- 使用 ESLint + Prettier
- 组件文件最多 200 行

## Git 约定
- 分支命名: feature/XXX, fix/XXX
- Commit 格式: type(scope): message
- PR 需要至少 1 人 review

## 目录约定
- src/components: UI 组件
- src/hooks: 自定义 Hooks
- src/utils: 工具函数
```

#### decisions.md

```markdown
# 技术决策记录 (ADR)

## ADR-001: 选择状态管理
日期: 2024-01-20
状态: 已通过

### 决策
使用 Zustand 作为状态管理方案

### 理由
- 轻量级
- TypeScript 友好
- 易于测试

### 替代方案
- Redux: 太复杂
- MobX: 装饰器语法

---

## ADR-002: 选择 UI 框架
日期: 2024-01-25
状态: 已通过

### 决策
使用 Tailwind CSS

### 理由
- 原子化 CSS
- 开发效率高
- 包体积小
```

## Memory 操作

### 添加记忆

```
记住这个项目的 API 设计遵循 RESTful 规范
```

```
记住用户偏好使用 async/await 而非 Promise.then
```

### 更新记忆

```
更新记忆：数据库已从 PostgreSQL 迁移到 MySQL
```

### 查询记忆

```
查看当前项目的所有记忆
```

```
这个项目之前解决了什么问题？
```

### 删除记忆

```
忘记之前的数据库配置
```

```
移除这个项目的性能优化记忆
```

## Memory 与上下文

### 上下文加载顺序

```
1. CLAUDE.md (最高优先级)
         ↓
2. Memory 文件
         ↓
3. 项目文件
         ↓
4. 用户输入
```

### 上下文限制

```
上下文窗口: 1M tokens
    ↓
已使用: 800K tokens
    ↓
Claude 自动压缩旧内容
    ↓
保留关键 Memory
```

## 高级 Memory 功能

### 结构化记忆

```markdown
# 用户偏好

## 技术偏好
- 语言: TypeScript, Python
- 框架: React, FastAPI
- 工具: Vite, Docker

## 沟通偏好
- 语言: 中文
- 详细程度: 详细
- 回复格式: Markdown
```

### 关联记忆

```markdown
# 相关记忆链接

## 相关文档
- 设计文档: /docs/design.md
- API 文档: /docs/api.md
- 部署文档: /docs/deploy.md

## 相关决策
- ADR-001: 状态管理选择
- ADR-002: UI 框架选择
```

### 记忆标签

```markdown
# 标签: #前端 #React #性能

这个组件存在性能问题，需要使用 React.memo 优化。
```

## Memory 最佳实践

### 1. 有组织的记忆

```
✅ 按主题分类
✅ 使用一致的命名
✅ 定期清理无用记忆

❌ 混乱的记忆文件
❌ 过时的信息
```

### 2. 及时更新

```
✅ 新决策后更新
✅ 问题解决后记录
✅ 项目变化时同步

❌ 忘记更新
❌ 过时信息
```

### 3. 相关性优先

```
✅ 记住重要信息
✅ 记住常用模式
✅ 记住用户偏好

❌ 记住一切
❌ 无关紧要的细节
```

### 4. 版本控制

```markdown
# 记忆文件应该纳入版本控制
git add .claude/memory/
git commit -m "docs: 添加项目记忆"
```

## 记忆清理

### 手动清理

```
/forget [topic]
```

### 自动清理

Claude Code 会自动清理：
- 重复的记忆
- 过时的信息
- 与当前项目无关的内容

### 完整重置

```
/reset-memory
```

## Memory 与 CLAUDE.md

### CLAUDE.md 中的 Memory 配置

```markdown
# 项目配置

## Memory 设置
memory:
  autoLoad: true           # 自动加载记忆
  autoSave: true           # 自动保存新记忆
  maxAge: 30d             # 记忆有效期
  syncMode: git           # 与 Git 同步

## 需要记住的内容
remember:
  - 项目架构
  - 代码规范
  - 团队成员
  - 技术决策
  - 重要上下文
```

### 排除的内容

```markdown
## 不需要记住
excludeFromMemory:
  - 临时文件
  - 调试输出
  - 个人信息
  - 敏感数据
```

## 跨项目记忆

### 全局记忆

在 `~/.claude/memory/` 中创建全局记忆：

```markdown
# 全局记忆

## 我的技术栈
- 前端: React, Vue, TypeScript
- 后端: Node.js, Python, Go
- 数据库: PostgreSQL, MongoDB
- DevOps: Docker, Kubernetes

## 工作习惯
- 喜欢先写测试
- 使用 Git Flow
- 偏好详细文档
```

### 项目特定记忆

在 `.claude/memory/` 中创建项目记忆：

```markdown
# 本项目特定信息
```

## 记忆同步

### Git 同步

```bash
# 在 .gitignore 中排除
.claude/memory/secrets/

# 但保留常规记忆
.gitignore
!.claude/memory/important.md
```

### 多设备同步

```
设备 A: 修改记忆
    ↓
推送到 Git
    ↓
设备 B: 拉取
    ↓
同步完成
```

## 记忆隐私

### 敏感信息处理

```markdown
# 记住但不存储敏感信息
记住：
- 使用环境变量存储密钥
- .env 文件不提交到 Git
- 定期轮换密钥

不要记住：
- 具体的密钥值
- 数据库密码
- API Token
```

### 安全建议

```
✅ 使用环境变量
✅ 使用密钥管理服务
✅ 定期清理敏感记忆

❌ 硬编码密码
❌ 记忆包含密钥
```

## 常见问题

### Q: Memory 会占用上下文空间吗？

A: 是的，但 Claude Code 会智能管理，只在需要时加载相关记忆。

### Q: 如何确保记忆准确？

A: 定期审查和更新记忆，使用 `/remember` 命令查看当前记忆。

### Q: 可以在多个项目间共享记忆吗？

A: 可以，在全局 `~/.claude/memory/` 中创建跨项目共享的记忆。

::: tip 实践建议
养成定期整理记忆的习惯。好的 Memory 系统可以大大提升 Claude Code 的效率和准确性。
:::
