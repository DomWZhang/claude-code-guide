# Rules 规则系统

Rules 是 Claude Code 的行为约束系统，通过 `CLAUDE.md` 文件定义项目级规则，确保 Claude 在整个会话中遵循一致的标准。

## 核心概念

Claude Code 会按以下顺序加载配置（优先级从低到高）：

```
~/.claude/settings.json       （全局用户设置）
    ↓
~/.claude/rules/               （用户级规则目录）
    ↓
<project>/CLAUDE.md            （项目规则 — 最高优先级）
    ↓
<project>/.claude/             （项目特定配置）
```

`CLAUDE.md` 是规则系统的核心，它同时承担**项目文档**和**行为指令**双重职责。

## CLAUDE.md 文件结构

一个完整的 `CLAUDE.md` 分为两大部分：

```
┌─────────────────────────────────────────────┐
│  第一部分：项目文档（面向人类）                │
│  — 项目介绍、技术栈、目录结构、常用命令         │
│  — Claude 和开发者都可以阅读                  │
└─────────────────────────────────────────────┘
│  （使用 --- 分隔）                            │
├─────────────────────────────────────────────┤
│  第二部分：[default] 指令（面向 Claude）        │
│  — role: 角色定义                           │
│  — expertise: 专业领域                        │
│  — workingStyle: 工作风格偏好                 │
│  — rules: 具体规则列表                        │
└─────────────────────────────────────────────┘
```

### 实际示例

以下是一个真实的 `CLAUDE.md`：

```markdown
# MyProject

## 项目概述

一个使用 Next.js 14 和 TypeScript 构建的 SaaS 平台。

## 技术栈

- Next.js 14 (App Router)
- TypeScript 5
- PostgreSQL + Prisma
- Tailwind CSS
- NextAuth.js

## 项目结构

```
src/
├── app/              # App Router 页面
│   ├── (auth)/       # 认证相关页面
│   └── (dashboard)/  # 仪表盘页面
├── components/       # React 组件
├── lib/             # 工具函数和库
├── db/              # Prisma schema 和迁移
└── types/           # TypeScript 类型定义
```

## 常用命令

- `npm run dev` — 开发服务器
- `npm run build` — 生产构建
- `npm run lint` — ESLint 检查
- `npx prisma db push` — 同步数据库 schema

---

[default]

role: Next.js 全栈工程师，熟悉 TypeScript、Prisma 和 Tailwind
expertise:
  - Next.js 14 App Router 和服务端组件
  - TypeScript 严格模式
  - Prisma ORM 和 PostgreSQL
  - Tailwind CSS 响应式设计
  - 安全性最佳实践（OWASP Top 10）

workingStyle:
  - 先规划后实现，使用 /plan 确认方案
  - 优先使用 TypeScript 严格类型，避免 any
  - 组件文件不超过 150 行，超出则拆分
  - 每次修改后运行 lint 和类型检查

rules:
  - 所有 API Route 必须有错误处理和类型定义
  - 禁止在客户端组件中直接访问数据库，使用 API Route
  - 使用环境变量处理所有敏感配置
  - 遵循 Next.js Image 组件规范优化图片
  - 登录/注册页面必须使用服务端组件
```

## [default] 指令详解

### role — 角色定义

定义 Claude 的角色定位，帮助它选择合适的视角和措辞：

```markdown
role: 全栈 TypeScript 开发者，10 年经验
```

**最佳实践**：
- 包含技术栈关键词
- 说明经验水平
- 包含工作风格关键词（如"优先测试"、"TDD"）

### expertise — 专业领域

列出 Claude 应该重点关注的知识领域。当涉及这些领域时，Claude 会更深入地分析：

```markdown
expertise:
  - React 18 和 TypeScript
  - PostgreSQL 数据库设计
  - RESTful API 设计
  - 单元测试和集成测试
  - Git Flow 工作流
```

### workingStyle — 工作风格

定义 Claude 的工作行为偏好：

```markdown
workingStyle:
  - 每次修改前先说明意图
  - 使用 TypeScript 严格类型
  - 代码遵循 ESLint 和 Prettier 规则
  - 优先使用函数式编程风格
  - 复杂逻辑添加注释解释
```

### rules — 具体规则列表

这是最核心的部分，定义 Claude **必须遵守**的规则：

```markdown
rules:
  - 所有 API 必须有输入验证（使用 zod）
  - 禁止使用 var，仅使用 const 和 let
  - 组件必须提供 TypeScript 接口
  - 测试覆盖率低于 80% 不允许合并
  - 所有敏感操作记录审计日志
  - API 错误返回统一格式：{ error: string, code: string }
```

## 高级配置

### 分级规则（Everything Claude Code）

[Everything Claude Code](/guide/ecosystem/everything-claude-code) 提供了分级规则架构，将规则按语言和通用性分类：

```
~/.claude/rules/
├── common/           # 通用规则（所有语言适用）
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md
│   └── security.md
├── typescript/       # TypeScript 专项规则
│   ├── types.md
│   ├── patterns.md
│   └── testing.md
├── python/           # Python 专项规则
│   ├── pep8.md
│   ├── type-hints.md
│   └── testing.md
└── golang/           # Go 专项规则
    ├── conventions.md
    └── testing.md
```

**common/testing.md 示例**：

```markdown
## 测试规范

### 覆盖率目标
- 新功能测试覆盖率 ≥ 80%
- 核心业务逻辑测试覆盖率 ≥ 95%
- API endpoint 全覆盖

### 测试文件命名
- 单元测试：`*.test.ts`
- 集成测试：`*.integration.test.ts`
- E2E 测试：`e2e/*.spec.ts`

### 测试原则
1. 每个 public 函数必须有测试
2. 测试名称必须描述预期行为
3. 使用 Given-When-Then 结构组织测试
4. Mock 外部依赖，不 Mock 同模块内部函数
```

### 项目级规则覆盖

在项目 `CLAUDE.md` 中可以覆盖用户级规则：

```markdown
# .claude/rules/nodejs-testing.md（用户级）

rules:
  - 测试覆盖率目标 70%
```

```markdown
# 项目 CLAUDE.md（项目级）

[default]

rules:
  # 覆盖用户级规则，提高标准
  - 测试覆盖率目标 85%
  - 每次提交前必须运行完整测试套件
```

## 实战规则模板

### TypeScript + React 项目

```markdown
[default]

role: TypeScript + React 专家，熟悉函数式编程和响应式设计
expertise:
  - React 18 和函数式组件
  - TypeScript 4.9+ 严格模式
  - 状态管理（Zustand / Jotai）
  - 组件库开发

workingStyle:
  - 组件优先设计 TypeScript 接口
  - 使用组合模式而非继承
  - 优先使用 hooks 封装逻辑

rules:
  # 类型安全
  - 禁止使用 any，优先使用 unknown + 类型守卫
  - 所有组件 Props 必须定义接口
  - API 响应必须定义类型

  # 代码组织
  - React 组件放在 src/components/
  - 自定义 Hook 放在 src/hooks/
  - 工具函数放在 src/utils/
  - 类型定义放在 src/types/

  # 组件规范
  - 使用函数组件，禁止使用 class 组件
  - 组件最多 200 行，超出则拆分
  - Props 接口名称 = 组件名称 + Props
  - 条件渲染使用 && 或三元表达式，避免嵌套

  # 测试
  - 组件必须有对应的 .test.tsx 文件
  - Hook 必须有对应的 .test.ts 文件
  - 测试关键用户交互路径
```

### Python FastAPI 项目

```markdown
[default]

role: Python FastAPI 后端工程师，熟悉异步编程和数据库设计
expertise:
  - FastAPI 和 Pydantic
  - PostgreSQL + SQLAlchemy (async)
  - JWT 认证和 OAuth2
  - RESTful API 设计
  - Python type hints

workingStyle:
  - 使用 async/await 处理 I/O 操作
  - Pydantic 模型用于所有数据验证
  - 统一错误处理和日志记录

rules:
  # 类型提示
  - 所有函数必须有类型注解
  - 使用 Union 而非 Optional（除非明确是可选值）
  - 使用 dataclass 或 Pydantic BaseModel 管理复杂对象

  # API 设计
  - 使用 HTTP 状态码标准（200/201/400/401/403/404/500）
  - 错误响应格式：{"detail": "错误描述", "code": "ERROR_CODE"}
  - 所有端点必须有 OpenAPI 文档注释

  # 数据库
  - 使用异步 session（async_sessionmaker）
  - 查询后立即 close 或使用 context manager
  - 敏感字段（密码等）永远不在响应中返回

  # 安全
  - 密码必须 bcrypt 哈希存储
  - JWT token 设置合理的过期时间
  - 所有输入必须验证（使用 Pydantic）
```

### Go 项目

```markdown
[default]

role: Go 后端工程师，遵循 Go 哲学和惯用写法
expertise:
  - Go 1.21+ 标准库和工具链
  - 结构和错误处理
  - 并发模式（goroutine / channel）
  - RESTful API 和中间件

workingStyle:
  - 遵循 Go 官方 effective go 规范
  - 错误作为返回值，不使用 panic
  - 接口设计符合小接口原则

rules:
  # 代码风格
  - 遵循 gofmt 自动格式化
  - 变量命名遵循 Google Go 风格指南
  - 注释必须符合 godoc 规范
  - 每个包导出内容必须有文档注释

  # 错误处理
  - 错误始终返回，不忽略（使用 _ 忽略的场景需注释说明）
  - 自定义错误使用 errors.New 或 fmt.Errorf
  - 错误链包含上下文（使用 %w）

  # 项目结构
  - 遵循 standard Go project layout
  - cmd/ 放入口点，pkg/ 放可复用代码
  - internal/ 放项目私有代码

  # 测试
  - 使用标准库 testing 包
  - 测试文件命名为 *_test.go
  - 表驱动测试用于多个相似场景
```

## 规则设计原则

### 1. 具体而非抽象

```
❌ 遵循最佳实践
✅ 使用 TypeScript 严格模式，所有变量必须标注类型
```

```
❌ 代码要清晰
✅ 函数名使用动词或动宾短语（getUserById, validateEmail）
  变量名使用名词或形容词（user, isValid, userList）
```

### 2. 包含「为什么」

```
# 好规则 — 包含理由
rules:
  - 禁止在循环中发起 HTTP 请求（性能：每次请求有 ~100ms 延迟）
  - 所有外部 API 调用必须设置 10 秒超时（防止无限等待）
  - 使用参数化查询而非字符串拼接（安全：防止 SQL 注入）

# 差规则 — 缺乏上下文
rules:
  - 优化性能
  - 设置超时
  - 注意安全
```

### 3. 适度数量

每个 `CLAUDE.md` 的 `rules` 部分建议控制在 **5-10 条**：

- 太少（< 5）：可能遗漏关键规范
- 适度（5-10）：最容易记忆和执行
- 太多（> 15）：Claude 可能无法全部遵守，项目维护成本高

如果规则很多，按类别分组：
```markdown
rules:
  # 代码质量
  - ...

  # 安全
  - ...

  # Git 工作流
  - ...
```

### 4. 可验证

让规则可以被验证：

```
❌ 代码要写得优雅
✅ 每个函数不超过 50 行（可数）
✅ Cyclomatic complexity < 10（可测）

❌ 要注意代码复用
✅ 重复超过 3 次的代码必须提取为函数（可检查）
```

## Rules 与其他系统的关系

| 系统 | 作用 | 生效时机 | 示例 |
|------|------|---------|------|
| **Rules** | 约束行为 | 生成代码时 | 「使用 TypeScript 严格模式」 |
| **Hooks** | 执行动作 | 事件触发时 | 自动格式化、权限检查 |
| **Agents** | 任务委托 | 复杂任务时 | 委托给代码审查 Agent |
| **Memory** | 持久化上下文 | 跨会话时 | 记住项目特殊配置 |

```
Rules 定义「做什么」和「怎么做」
Hooks 定义「在什么时机做什么额外动作」
Agents 定义「什么任务委托给谁」
Memory 定义「什么信息需要记住」
```

## 查看当前应用的规则

```bash
/rules
```

Claude Code 会显示当前会话加载的所有规则来源和内容。

## 与 Everything Claude Code 的集成

ECC 的分级规则系统会自动合并到项目规则中：

```bash
# 查看所有活动的规则
# ECC 会自动加载 rules/common/*.md 和 rules/<language>/*.md

# 强制重新加载规则
# 在新会话开始时生效
```

## 常见问题

**Q: 规则太多了应该怎么组织？**

A: 将通用规则放在 `~/.claude/rules/`，项目特定规则放在 `CLAUDE.md` 中。ECC 用户可以利用其分级规则系统。

**Q: 规则和 Git Hooks 冲突了怎么办？**

A: Rules 是给 Claude 的指令，Git Hooks 是给 Git 的指令。两者互补。Claude Code 会尝试遵守规则，但如果项目 Git Hooks 失败（lint、test），会阻止提交。

**Q: 临时忽略某些规则？**

A: 可以直接告诉 Claude「这次忽略某某规则」，但建议说明原因。

**Q: 如何让规则对团队成员生效？**

A: 将 `CLAUDE.md` 提交到版本控制，团队成员克隆仓库后自动获得相同规则。

::: tip 规则是起点，不是终点
好的规则不是一次性写完的。随着项目发展，定期回顾 `CLAUDE.md`，添加新学到的教训，删除不适用的规则。建议每个季度审查一次。
:::
