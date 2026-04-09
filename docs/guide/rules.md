# Rules

Rules 是 Claude Code 中的规则系统，用于定义项目的编码规范、行为准则和工作流程。

## 什么是 Rules？

Rules 是一组定义在 `CLAUDE.md` 文件中的指令，告诉 Claude Code：
- 如何编写代码
- 遵循什么规范
- 如何处理特定情况
- 项目的特殊要求

```
CLAUDE.md
    ↓
Claude Code 加载规则
    ↓
每次对话应用规则
    ↓
生成符合规范的代码
```

## Rules 文件结构

### 基础结构

```markdown
# Project Name

[default]
# 默认规则 - 所有 Agent 都要遵守

[rules]
# 详细规则定义

[specialist:xxx]
# 特定 Agent 的规则
```

### 完整示例

```markdown
# MyAwesomeProject

## 项目概述
这是一个现代化的 React + TypeScript 项目。

## 技术栈
- React 18
- TypeScript 5
- Vite
- Tailwind CSS

---

[default]

# 代码规范
codeStandards:
  language: TypeScript
  strictMode: true
  prettier: true

# 文件组织
fileOrganization:
  components: src/components
  hooks: src/hooks
  utils: src/utils
  types: src/types

---

[rules]

## 代码风格

### 命名规范
- 组件: PascalCase (UserCard.tsx)
- Hooks: camelCase 前缀 use (useUser.ts)
- 工具函数: camelCase (formatDate.ts)
- 常量: UPPER_SNAKE_CASE
- 类型/接口: PascalCase (UserProfile)

### 代码格式
- 使用 2 空格缩进
- 每行最多 100 字符
- 字符串使用单引号
- 末尾添加分号

### TypeScript 规范
- 启用 strict 模式
- 避免使用 any
- 使用 interface 定义对象类型
- 使用 type 定义联合类型

## 组件规范

### 组件结构
```tsx
interface Props {
  title: string
  onClick: () => void
}

export function Button({ title, onClick }: Props) {
  return (
    <button onClick={onClick}>
      {title}
    </button>
  )
}
```

### Hooks 规范
- 自定义 Hook 必须以 `use` 开头
- 每个 Hook 只做一件事
- 在 Hook 顶部声明所有 state

---

[specialist:frontend]

## 前端特定规则
- 使用函数组件和 Hooks
- 组件文件最多 200 行
- 提取可复用的逻辑到 Hooks
- 使用 CSS Modules 或 Tailwind

---

[specialist:reviewer]

## 审查规则
- 检查命名规范
- 检查类型安全
- 检查性能影响
- 检查可访问性
```

## Rules 类型

### 1. 代码风格规则

```markdown
[rules:code-style]

## 缩进
indent: 2 spaces

## 引号
quotes: single

## 分号
semicolons: required

## 换行
lineLength: 100
```

### 2. 技术规范规则

```markdown
[rules:tech-specs]

## TypeScript
typescript:
  strict: true
  noImplicitAny: true
  strictNullChecks: true

## React
react:
  version: 18
  hooksOnly: true
  fileExtensions: [.tsx, .jsx]

## CSS
css:
  methodology: BEM
  preprocessor: Tailwind
```

### 3. 项目结构规则

```markdown
[rules:structure]

src/
├── components/    # UI 组件
│   ├── common/    # 通用组件
│   └── features/  # 特性组件
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
├── types/         # 类型定义
├── api/           # API 调用
└── pages/         # 页面组件
```

### 4. Git 工作流规则

```markdown
[rules:git]

## Commit 规范
commitFormat: |
  <type>(<scope>): <subject>

  <body>

  <footer>

types:
  - feat: 新功能
  - fix: 修复 bug
  - docs: 文档更新
  - style: 代码格式
  - refactor: 重构
  - test: 测试
  - chore: 构建/工具

## Branch 规范
branchNaming: |
  <type>/<issue-number>-<description>

examples:
  - feature/123-add-user-login
  - fix/456-resolve-auth-error
  - hotfix/789-critical-security
```

### 5. 测试规则

```markdown
[rules:testing]

## 测试要求
- 所有新功能必须有测试
- 测试覆盖率 > 80%
- 单元测试覆盖核心逻辑
- 集成测试覆盖关键流程

## 测试文件位置
tests/
├── unit/          # 单元测试
├── integration/   # 集成测试
└── e2e/          # E2E 测试

## 测试命名
testNaming: |
  describe(<模块>)
    it(<操作> <预期结果>)
```

### 6. 安全规则

```markdown
[rules:security]

## 敏感信息
- 禁止硬编码密钥
- 使用环境变量
- .env 不提交到 Git

## 依赖安全
- 定期更新依赖
- 检查已知漏洞
- 使用官方包

## 输入验证
- 验证所有用户输入
- 防止 SQL 注入
- 防止 XSS 攻击
```

## Rules 语法

### 基本语法

```markdown
# 单行规则
ruleName: value

# 多行规则
ruleName: |
  line 1
  line 2
  line 3

# 列表
ruleList:
  - item1
  - item2
  - item3

# 对象
ruleObject:
  key1: value1
  key2: value2
```

### 条件规则

```markdown
[rules]

## 当使用 React 时
when:
  framework: react
then:
  - 使用函数组件
  - 使用 Hooks
  - 组件文件 .tsx

## 当使用 Python 时
when:
  language: python
then:
  - 使用类型提示
  - 遵循 PEP 8
  - 使用 dataclasses
```

### 优先级

```markdown
[default]
# 最低优先级
priority: 1

[specialist:xxx]
# 中等优先级
priority: 2

[rules:critical]
# 最高优先级
priority: 3
```

## Rules 应用场景

### 1. 新项目初始化

```markdown
[rules:project-init]

## 新项目必须包含
requiredFiles:
  - README.md
  - LICENSE
  - .gitignore
  - package.json
  - tsconfig.json

## 初始配置
- 设置 ESLint
- 设置 Prettier
- 设置 CI/CD
- 配置 Git hooks
```

### 2. 代码审查规则

```markdown
[rules:code-review]

## 必须检查
- [ ] 类型正确性
- [ ] 错误处理
- [ ] 性能影响
- [ ] 安全性
- [ ] 可测试性

## 评分标准
- 命名清晰度: 20%
- 代码简洁度: 20%
- 逻辑完整性: 20%
- 测试覆盖度: 20%
- 文档完整性: 20%
```

### 3. API 开发规则

```markdown
[rules:api]

## RESTful 规范
restGuidelines:
  - 使用标准 HTTP 方法
  - 使用名词而非动词
  - 适当的 HTTP 状态码
  - 版本控制 /api/v1/

## 响应格式
responseFormat: |
  {
    "success": boolean,
    "data": object,
    "error": {
      "code": string,
      "message": string
    }
  }

## 错误码
errorCodes:
  400: Bad Request
  401: Unauthorized
  403: Forbidden
  404: Not Found
  500: Internal Server Error
```

### 4. 数据库规则

```markdown
[rules:database]

## 表命名
tableNaming: snake_case

## 字段命名
fieldNaming: snake_case

## 主键
primaryKey: id (UUID)

## 时间戳
timestamps:
  createdAt: created_at
  updatedAt: updated_at

## 软删除
softDelete: true
deletedAt: deleted_at
```

## Rules 继承

### 全局规则

在 `~/.claude/defaults.md` 中定义全局规则：

```markdown
# 全局默认规则
[default]

## 通用代码规范
- 使用 UTF-8 编码
- 文件末尾换行
- 移除未使用的导入
```

### 项目规则

在项目 `CLAUDE.md` 中覆盖：

```markdown
# 项目特定规则
[default]

## 覆盖全局设置
lineLength: 120
```

### 结果

```
全局规则 (80%)
    ↓
项目规则 (100%)
    ↓
最终应用
```

## Rules 调试

### 查看应用的规则

```
/rules
```

Claude Code 会显示当前加载的所有规则。

### 测试规则

```
按照规则审查 src/auth/login.ts
```

### 临时覆盖

```
暂时忽略 TypeScript strict 模式，完成任务后恢复
```

## Rules 最佳实践

### 1. 保持简洁

```
✅ 清晰简洁的规则
❌ 过于复杂的规则
```

### 2. 具体明确

```
✅ 当创建 React 组件时，使用函数组件
❌ 遵循最佳实践
```

### 3. 提供示例

```markdown
## 命名规范
✅ 正确示例: `getUserById`, `UserCard`
❌ 错误示例: `getData`, `Component1`
```

### 4. 定期更新

```markdown
# 每季度审查一次规则
# 根据项目变化调整
# 移除不适用的规则
```

### 5. 分类组织

```markdown
[rules:code-style]      # 代码风格
[rules:testing]         # 测试规范
[rules:security]        # 安全规范
[rules:git]             # Git 规范
[rules:performance]      # 性能规范
```

## Rules 与其他系统

### Rules vs Hooks

| 特性 | Rules | Hooks |
|------|-------|-------|
| 执行时机 | 生成代码时 | 操作前后 |
| 作用 | 定义规范 | 执行动作 |
| 示例 | 命名规范 | 自动格式化 |

### Rules vs Agents

| 特性 | Rules | Agents |
|------|-------|--------|
| 作用域 | 全局 | 特定任务 |
| 粒度 | 细粒度 | 粗粒度 |
| 组合 | 多个 Rules | 单个 Agent |

## 常用 Rules 模板

### React 项目

```markdown
[rules:react]

## 组件规则
- 使用函数组件
- 使用 Hooks 管理状态
- PropTypes 或 TypeScript
- 组件文件最多 200 行

## 目录结构
src/
├── components/
├── hooks/
├── utils/
├── types/
├── api/
└── pages/
```

### Node.js 项目

```markdown
[rules:nodejs]

## Express 规则
- 使用中间件模式
- 错误中间件放最后
- 使用 async/await
- 统一错误处理

## 模块结构
module.exports = {
  // 导出内容
}
```

### Python 项目

```markdown
[rules:python]

## PEP 8 规范
- 4 空格缩进
- 行长度 79 字符
- 使用 type hints
- docstring 文档

## Django 规则
- 使用 CBV
- Model 命名单数
- 命名空间隔离
```

::: tip 实践建议
Rules 是确保代码一致性的关键。建议从简单的规则开始，逐步完善，避免一开始就定义过于复杂的规则。
:::
