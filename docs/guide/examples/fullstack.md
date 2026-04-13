# 实战案例：全栈应用开发

本章通过构建一个完整的全栈应用（Next.js + Supabase），展示 Claude Code 在实际项目开发中的完整工作流。

## 项目概述

**应用名称**：TaskFlow - 团队任务管理工具

**技术栈**：
- 前端：Next.js 14 (App Router) + TypeScript + Tailwind CSS
- 后端：Next.js API Routes + Supabase
- 数据库：PostgreSQL (Supabase)
- 认证：Supabase Auth
- 部署：Vercel

## 第一阶段：项目初始化

### 1. 创建项目

```
创建一个 Next.js 14 项目，使用 App Router，TypeScript，Tailwind CSS。
项目名称：taskflow
```

Claude Code 执行：
```bash
npx create-next-app@latest taskflow --typescript --tailwind --app
cd taskflow
```

### 2. 安装依赖

```
安装以下依赖：
- @supabase/supabase-js
- @supabase/ssr
- zod (验证)
- react-hook-form
- date-fns
- lucide-react (图标)
```

### 3. 配置环境变量

```
创建 .env.local 文件，包含：
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 第二阶段：数据库设计

### 设计 Schema

```
设计任务管理系统的数据库 schema，包含以下表：
- users (关联 Supabase auth.users)
- tasks (id, title, description, status, priority, due_date, created_by, assigned_to, created_at, updated_at)
- task_comments (id, task_id, user_id, content, created_at)

输出 SQL 迁移脚本。
```

Claude Code 输出：

```sql
-- supabase/migrations/20240101000000_init.sql

-- 任务表
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 任务评论表
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);

-- 行级安全策略 (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- 用户只能看到自己创建或被分配的任务
CREATE POLICY "Users can view their tasks" ON tasks
  FOR SELECT USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- 用户只能创建自己的任务
CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- 用户只能更新自己的任务或被分配的任务
CREATE POLICY "Users can update their tasks" ON tasks
  FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = assigned_to);
```

## 第三阶段：Supabase 客户端配置

### 创建 Supabase 客户端

```
创建 lib/supabase/client.ts，配置 Supabase 客户端用于客户端组件。
创建 lib/supabase/server.ts，配置用于服务端组件和 API 路由。
```

Claude Code 输出：

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

## 第四阶段：API 路由实现

### 任务 CRUD API

```
创建 app/api/tasks/route.ts，实现：
- GET: 获取用户的任务列表（支持分页、筛选）
- POST: 创建新任务

创建 app/api/tasks/[id]/route.ts，实现：
- GET: 获取单个任务详情
- PUT: 更新任务
- DELETE: 删除任务
```

Claude Code 输出示例（GET 方法）：

```typescript
// app/api/tasks/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  // 验证用户认证
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 解析查询参数
  const url = new URL(request.url)
  const params = querySchema.safeParse({
    status: url.searchParams.get('status'),
    priority: url.searchParams.get('priority'),
    page: url.searchParams.get('page'),
    limit: url.searchParams.get('limit'),
  })

  if (!params.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
  }

  const { status, priority, page, limit } = params.data
  const offset = (page - 1) * limit

  // 构建查询
  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)

  if (status) query = query.eq('status', status)
  if (priority) query = query.eq('priority', priority)

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}
```

## 第五阶段：前端组件开发

### 任务列表组件

```
创建 components/TaskList.tsx，功能：
- 显示任务列表
- 按状态筛选
- 按优先级筛选
- 分页
- 点击任务进入详情
```

### 任务创建表单

```
创建 components/TaskForm.tsx，使用 react-hook-form + zod 验证，包含：
- 标题（必填）
- 描述（可选）
- 优先级（下拉）
- 截止日期（日期选择器）
- 分配给（用户搜索选择）
```

### 使用 Claude Code 生成组件

```
创建一个任务卡片组件 TaskCard，接收 task 对象作为 props，
显示标题、状态、优先级、截止日期，
状态用不同颜色标签，优先级用不同图标，
支持拖拽改变状态。
```

## 第六阶段：测试与验证

### 生成测试

```
为 TaskList 组件生成单元测试，使用 Jest + React Testing Library，
测试：
- 组件渲染
- 筛选功能
- 分页功能
- 空状态显示
```

### 运行测试

```
运行 npm test，如果有失败的测试请修复。
```

## 第七阶段：部署配置

### Vercel 部署

```
创建 vercel.json 配置文件，确保 Next.js 正确部署。
环境变量需要在 Vercel 中配置：
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 部署前检查

```
运行以下检查：
1. npm run build 成功
2. 所有类型检查通过
3. 测试通过
4. 无 lint 错误
```

## 优化与迭代

### 性能优化

```
分析当前应用的性能问题，提出优化建议：
1. 使用 React.memo 优化 TaskCard
2. 实现虚拟滚动处理大量任务
3. 添加 loading 状态
4. 实现乐观更新
```

### 添加新功能

```
添加任务搜索功能：
- 在 TaskList 组件中添加搜索框
- 搜索标题和描述
- 防抖处理
```

## 完整工作流总结

| 阶段 | Claude Code 任务 | 耗时 |
|------|------------------|------|
| 初始化 | 创建项目、安装依赖 | 2 分钟 |
| 数据库 | 设计 schema、生成迁移 | 5 分钟 |
| 后端 | API 路由实现 | 10 分钟 |
| 前端 | 组件开发 | 15 分钟 |
| 测试 | 生成单元测试 | 5 分钟 |
| 部署 | 配置部署 | 3 分钟 |

**总计**：约 40 分钟完成全栈应用开发。

## 与 Claude Code 的协作技巧

1. **逐步迭代**：不要一次要求所有功能，分阶段实现
2. **提供示例**：给出期望的代码结构示例
3. **明确约束**：指定技术栈版本、代码规范
4. **及时反馈**：发现问题立即指出，Claude 会修正
5. **复用上下文**：同一会话中继续开发，Claude 会记住已有代码

::: tip
完整的项目代码可参考 [GitHub 仓库示例](https://github.com/example/taskflow)。
:::
