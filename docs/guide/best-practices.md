# 最佳实践

本节总结了在日常使用 Claude Code 过程中的最佳实践和经验总结。

## 通用最佳实践

### 1. 清晰的需求描述

```
✅ 好的描述
"在 src/components/ 目录下创建一个 UserCard 组件，
包含头像、用户名、邮箱三列，使用 Tailwind CSS，
支持点击用户名跳转详情页"

❌ 差的描述
"创建用户卡片"
```

**技巧**:
- 指明具体的文件路径
- 描述期望的输入和输出
- 说明使用的技术栈
- 描述用户交互行为

### 2. 分步骤执行

```
# ❌ 一步到位（可能失败）
"创建一个完整的用户管理系统"

# ✅ 分步骤进行
1. "设计用户数据模型"
2. "创建用户相关的 API"
3. "创建用户列表页面"
4. "创建用户详情页面"
5. "添加用户搜索功能"
```

### 3. 及时反馈

```
# ✅ 错误时立即指出
"不对，我需要的是编辑功能，不是删除"

# ✅ 确认理解
"你的意思是每次点击都要保存吗？"

# ✅ 补充信息
"补充一下，这个表格需要支持排序"
```

### 4. 指定范围

```
# ✅ 明确指定文件
"修改 src/utils/format.ts 中的日期格式化函数"

# ✅ 排除不需要的文件
"只看 src/api/ 下的文件，不要看 tests/"

# ✅ 指定工作目录
"在 src/components/ 目录下工作"
```

## 项目结构最佳实践

### 1. 维护 CLAUDE.md

```markdown
# ✅ 好的 CLAUDE.md

# MyProject

## 项目概述
- React + TypeScript 单页应用
- 使用 Zustand 状态管理
- Tailwind CSS 样式

## 代码规范
- TypeScript strict 模式
- 组件文件最多 200 行
- 使用函数组件

## 目录结构
- src/components: UI 组件
- src/hooks: 自定义 Hooks
- src/utils: 工具函数
- src/api: API 调用

## 常用命令
- npm run dev: 开发模式
- npm test: 运行测试
- npm run build: 构建
```

### 2. 使用 .claudeignore

```
# .claudeignore
node_modules/
dist/
build/
*.log
.env
.env.local
coverage/
.cache/
```

### 3. 合理的文件组织

```
src/
├── components/       # 小组件（< 100 行）
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── features/        # 大组件和页面
│   ├── User/
│   │   ├── UserList.tsx
│   │   ├── UserDetail.tsx
│   │   └── hooks/
│   └── Product/
├── shared/          # 共享代码
│   ├── hooks/
│   ├── utils/
│   └── types/
└── api/             # API 定义
```

## 代码质量最佳实践

### 1. 遵循项目规范

```typescript
// ✅ 遵循项目命名规范
export function formatUserName(name: string): string

// ❌ 忽略项目规范
export function format_username(name: string): string
```

### 2. 保持代码简洁

```typescript
// ✅ 简洁清晰
const isActive = user.status === 'active'

// ❌ 过于复杂
const isActive = user.status ? (user.status === 'active' ? true : false) : false
```

### 3. 完善的错误处理

```typescript
// ✅ 好的错误处理
try {
  const data = await fetchUser(id)
  if (!data) {
    throw new Error(`User ${id} not found`)
  }
  return data
} catch (error) {
  logger.error('Failed to fetch user', { id, error })
  throw error
}

// ❌ 没有错误处理
const data = await fetchUser(id)
return data
```

### 4. 写有意义的注释

```typescript
// ✅ 解释为什么
// 使用 Map 而不是对象，因为需要保持插入顺序
const roleMap = new Map(roles.map(r => [r.id, r]))

// ❌ 描述代码做什么（代码已经说明了）
// 遍历角色
roles.forEach(role => { ... })
```

## 安全性最佳实践

### 1. 敏感信息处理

```
✅ 使用环境变量
API_KEY=${API_KEY}

❌ 硬编码密钥
API_KEY="sk-ant-xxxx"

✅ 在 CLAUDE.md 中提醒
# 注意：不要在代码中硬编码任何密钥
```

### 2. 验证用户输入

```typescript
// ✅ 验证输入
function createUser(input: unknown) {
  const parsed = UserSchema.parse(input) // 使用 zod 等验证
  // ...
}

❌ 不验证
function createUser(input: any) {
  db.insert(input) // 危险！
}
```

### 3. Git 操作谨慎

```
✅ 先查看状态
/git status

✅ 使用 --dry-run 预览
/git rm --dry-run -rf node_modules/

✅ 每次提交只包含相关更改
/git add src/auth/
git commit -m "fix: 修复登录验证"
```

## 效率最佳实践

### 1. 复用代码

```
✅ 复用现有代码
"将 src/hooks/useFetch.ts 的模式应用到新的 API"

❌ 重复造轮子
"创建一个新的数据获取 hook"
```

### 2. 使用模板

```typescript
// ✅ 使用项目模板
"按照 src/templates/Feature.ts 的结构创建新功能"

❌ 从零开始
"创建一个新的功能模块"
```

### 3. 渐进式开发

```
1. 创建基础功能
2. 添加基本测试
3. 逐步完善
4. 性能优化
5. 文档完善
```

### 4. 善用快捷命令

```bash
# ✅ 使用 slash 命令
/test src/utils/auth.ts
/rules

# ✅ 使用别名
alias c="claude"
c "帮我审查代码"
```

## 团队协作最佳实践

### 1. 共享配置

```markdown
# CLAUDE.md 中包含团队规范
## 代码审查
- 所有 PR 需要至少 2 人 review
- 审查清单：
  - [ ] 类型安全
  - [ ] 测试覆盖
  - [ ] 文档更新
```

### 2. 记录决策

```markdown
# .claude/memory/decisions.md

## ADR-001: 选择状态管理方案
日期: 2024-01-15
决策: 使用 Zustand

原因:
- 轻量级
- TypeScript 友好
- 易于测试

## ADR-002: 选择 UI 框架
日期: 2024-01-20
决策: 使用 Tailwind CSS
```

### 3. 代码共享规范

```
✅ 共享可复用的工具函数
src/shared/utils/

❌ 每个模块复制相同代码
```

## 测试最佳实践

### 1. 测试驱动开发

```
1. 描述期望的行为
2. 让 Claude 生成测试
3. 运行测试（应该失败）
4. 实现功能
5. 运行测试（应该通过）
```

### 2. 全面覆盖

```typescript
// ✅ 测试正常情况
test('should return user when id is valid', () => {
  expect(getUser('123')).toEqual({ id: '123', name: 'John' })
})

// ✅ 测试边界情况
test('should throw when id is empty', () => {
  expect(() => getUser('')).toThrow()
})

// ✅ 测试错误情况
test('should return null when user not found', () => {
  expect(getUser('invalid')).toBeNull()
})
```

### 3. 自动化测试集成

```bash
# 在每次代码修改后自动运行测试
npm test

# 或在 Hook 中自动测试
# .claude/hooks/post-edit.sh
npm test -- --watchAll=false
```

## 性能最佳实践

### 1. 减少上下文

```
✅ 只加载需要的文件
"只查看 src/api/ 目录下的文件"

❌ 一次性查看所有文件
```

### 2. 批量操作

```
✅ 一次处理多个文件
"将 src/components/ 下所有 JSX 转换为 TSX"

❌ 一个一个修改
```

### 3. 缓存结果

```
✅ 记住常用操作结果
"记住这个项目的数据库配置"

❌ 每次都重新查询
```

## 安全最佳实践

### 1. 权限最小化

```json
{
  "tools": {
    "Bash": {
      "allowedCommands": ["npm *", "git *"],
      "deniedCommands": ["rm -rf /*"]
    }
  }
}
```

### 2. 危险的命令需要确认

```
⚠️ 即将执行危险操作
确认是否继续？ [y/N]
```

### 3. 定期审查日志

```bash
# 查看操作日志
cat ~/.claude/logs/commands.log

# 检查异常操作
grep -i "rm" ~/.claude/logs/commands.log
```

## 持续改进

### 1. 收集反馈

```markdown
# .claude/memory/feedback.md

## 用户反馈
- 2024-01-15: 生成的代码有时类型不够精确
  → 需要在 CLAUDE.md 中强调严格类型检查

- 2024-01-20: 忘记在提交前运行测试
  → 添加 pre-commit hook
```

### 2. 优化配置

```markdown
# 根据使用情况调整
- 发现某个规则不常用 → 移除
- 发现缺少某个规范 → 添加
- 发现某个命令很常用 → 创建别名
```

### 3. 分享经验

```
✅ 总结使用技巧
✅ 分享成功的项目配置
✅ 帮助团队成员
```

## 检查清单

在完成每个任务后，检查以下内容：

- [ ] 代码符合项目规范
- [ ] 所有测试通过
- [ ] 没有硬编码敏感信息
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] Git 提交信息清晰
- [ ] 代码经过审查

::: tip 持续学习
最佳实践不是一成不变的。根据项目需求和团队情况，不断调整和改进使用方式。
:::
