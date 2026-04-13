# Skill Creator：从 Git 历史自动生成技能

Skill Creator 是 Everything Claude Code 生态中的自动化技能生成工具。它通过分析项目的 Git 历史（commit messages、代码 diff、PR descriptions），自动提取团队在开发过程中反复使用的代码模式和工作流程，生成可复用的 SKILL.md 文件。

## 为什么需要 Skill Creator？

在日常开发中，团队会反复遇到相似的任务：
- 每次创建 API 端点都要写相同的错误处理模式
- 每次实现数据库模型都要遵循相同的结构
- 每次写测试都要使用相同的断言风格

Skill Creator 从 Git 历史中自动识别这些模式，让 Claude Code 能够**像团队成员一样思考**。

## 工作原理

```
Git 历史 (Commits, PRs, Diff)
         │
         ▼
┌─────────────────────────────┐
│  1. Commit 分析             │
│  - 提取 commit messages     │
│  - 识别重复的描述模式         │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  2. Diff 模式识别           │
│  - 分析代码变更的结构         │
│  - 提取通用的代码模式         │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  3. PR 描述提取             │
│  - 从 PR 中提取决策上下文     │
│  - 识别技术决策的模式         │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  4. Skill 生成              │
│  - 输出 SKILL.md 文件        │
│  - 包含 trigger、actions     │
└─────────────────────────────┘
```

## 安装

```bash
# 作为 ECC 的一部分安装
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
./install.sh skill-creator

# 或独立安装
npm install -g skill-creator
```

## 基础使用

### 1. 初始化分析

```bash
# 在项目根目录运行
skill-creator init

# 配置分析参数
skill-creator init \
  --commits 500 \        # 分析最近 500 个 commits
  --prs 100 \            # 分析最近 100 个 PRs
  --languages typescript \ # 关注的语言
  --output ./skills      # 输出目录
```

### 2. 生成 Skill

```bash
# 分析并生成所有识别的 skills
skill-creator generate

# 只生成特定类型的 skill
skill-creator generate --type api-design
skill-creator generate --type testing
skill-creator generate --type error-handling

# 生成指定文件的 skill
skill-creator generate --pattern "src/api/**/*.ts"
```

### 3. 查看生成结果

```bash
# 列出所有生成的 skills
skill-creator list

# 查看 skill 详情
skill-creator show api-design-pattern

# 预览 skill 内容
skill-creator preview my-custom-skill
```

## 输出格式

### SKILL.md 结构

```markdown
---
name: api-design-pattern
description: RESTful API 端点设计模式
confidence: 0.87
usage_count: 42
source:
  commits: 156
  prs: 23
---

## Trigger（触发条件）

当用户描述以下场景时激活：
- 创建 API 端点
- 设计 REST 接口
- 实现 CRUD 操作
- 添加新的 API 路由

## Actions（执行动作）

### 1. 标准目录结构
```
src/api/{resource}/
├── route.ts      # 路由定义
├── controller.ts # 控制器
├── service.ts   # 业务逻辑
├── schema.ts    # Zod schema
└── index.ts     # 导出
```

### 2. 标准错误处理
```typescript
export async function handler(req: Request) {
  try {
    const validated = schema.parse(req.body)
    const result = await service.create(validated)
    return Response.json({ data: result }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    logger.error('API Error', { error, path: req.url })
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

### 3. 标准 Schema
```typescript
import { z } from 'zod'

export const CreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
})

export const UpdateSchema = CreateSchema.partial()
```

## 深度分析模式

### API 设计模式

```bash
skill-creator analyze --pattern "src/api/**"
```

识别到的模式：
- 路由命名规范：`/api/{resource}`
- 错误响应格式：`{ error: string, details?: any }`
- 成功响应格式：`{ data: T, meta?: PaginationMeta }`
- 认证方式：`Authorization: Bearer {token}`

### 数据库模式

```bash
skill-creator analyze --pattern "**/models/**" --language typescript
```

识别到的模式：
- Prisma schema 结构
- 迁移命名规范
- 关联定义模式

### 测试模式

```bash
skill-creator analyze --pattern "**/*.test.ts"
```

识别到的模式：
- 测试描述命名：`describe('ResourceName')`
- 断言风格：`expect().toEqual()`
- Mock 模式：使用 jest.mock
- 覆盖率目标：80%+

## 与 ECC 集成

### 导入到 ECC Skills

```bash
# 将生成的 skill 导入 ECC
skill-creator import --skill ./skills/api-design-pattern.md

# 或批量导入
skill-creator import --all

# 查看导入状态
skill-creator status
```

### 配置触发条件

在生成的 SKILL.md 中自定义 trigger：

```markdown
## Custom Triggers

- 用户提到"新的接口"
- 用户提到"添加 CRUD"
- 用户提到"REST API"
```

## 置信度系统

Skill Creator 为每个生成的 skill 计算置信度分数：

| 置信度 | 含义 | 建议 |
|--------|------|------|
| 0.9+ | 高置信度，非常可靠 | 直接使用 |
| 0.7-0.9 | 中高置信度，建议审核后使用 | 查看生成的代码 |
| 0.5-0.7 | 中等置信度，需要仔细审核 | 手动调整后使用 |
| < 0.5 | 低置信度，可能不准确 | 建议手动创建 |

### 提高置信度

```bash
# 分析更多 commits
skill-creator generate --commits 1000

# 指定特定的文件模式
skill-creator generate --pattern "src/core/**/*.ts"

# 排除非典型代码
skill-creator generate --exclude "**/test/**" --exclude "**/migrations/**"
```

## 团队协作

### 导出/导入

```bash
# 导出 skills 到文件
skill-creator export --output ./team-skills/

# 团队成员导入
skill-creator import --from ./team-skills/

# 版本控制
git add skills/
git commit -m "chore: 更新团队 skills"
```

### CI 集成

```yaml
# .github/workflows/skills-update.yml
name: Update Team Skills

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * 0'  # 每周日凌晨 2 点

jobs:
  update-skills:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install skill-creator
        run: npm install -g skill-creator

      - name: Generate skills
        run: skill-creator generate --prs 500

      - name: Create PR with new skills
        run: |
          skill-creator export --output ./new-skills/
          git diff --quiet && echo "No changes" || \
            git add skills/ && \
            git checkout -b chore/update-skills && \
            git commit -m "chore: 更新团队 skills" && \
            gh pr create --title "chore: 更新团队 skills" --body "自动更新的 skills"
```

## 故障排除

### 没有识别到模式

```bash
# 检查 Git 历史是否足够
git log --oneline | wc -l

# 增加分析范围
skill-creator generate --commits 2000 --prs 500

# 检查文件模式是否匹配
skill-creator analyze --pattern "src/**/*.ts" --verbose
```

### 置信度过低

- 增加分析的 commits 数量
- 确保代码库有足够的同类型任务
- 排除临时性/实验性代码

### 生成的文件冲突

```bash
# 查看冲突
skill-creator list --conflicts

# 解决冲突
skill-creator resolve --skill api-design-pattern

# 手动合并
skill-creator merge --skill1 old-skill --skill2 new-skill
```

## 最佳实践

1. **定期更新**：建议每周或每月重新生成 skills，反映最新的团队模式
2. **审核后使用**：置信度 < 0.7 的 skill 需要人工审核
3. **版本控制**：将生成的 skills 纳入版本控制，追踪团队规范演进
4. **团队共享**：定期导出 skills 供团队成员使用
5. **与 ECC 结合**：将生成的 skills 导入 ECC skills 系统，获得更强的编排能力

## 资源链接

- [ECC GitHub 仓库](https://github.com/affaan-m/everything-claude-code)
- [Skill Creator npm](https://www.npmjs.com/package/skill-creator)

::: tip
Skill Creator 是团队知识沉淀的自动化工具。建议在项目运行 3 个月后或完成 200+ commits 后使用，能获得最有价值的技能。
:::
