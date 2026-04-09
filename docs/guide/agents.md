# Agents

Agents 是 Claude Code 最强大的特性之一，允许你创建专门的 AI 代理来处理特定任务。

## 什么是 Agent？

Agent 是一个专门配置和优化的 Claude 实例，专门用于处理特定类型的任务。

```
传统方式：
用户 → [通用对话] → 结果

Agent 方式：
用户 → [专业 Agent] → 更精确的结果
```

## Agent 工作原理

### 核心原理

1. **专门配置** - 每个 Agent 有自己的系统提示词
2. **角色定义** - 定义 Agent 的专业领域
3. **工具集** - 为 Agent 配置专用工具
4. **行为规范** - 定义 Agent 的工作方式

### Agent 决策循环

```
┌─────────────────────────────────┐
│          Agent 启动              │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│    接收任务/消息                 │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│  思考：我需要做什么？             │
└─────────────────────────────────┘
                ↓
        ┌───────────────┐
        │  需要工具？    │
        └───────────────┘
           ↓         ↓
          是         否
           ↓         ↓
┌────────────┐  ┌────────────┐
│ 调用工具   │  │ 生成响应   │
└────────────┘  └────────────┘
           ↓         ↓
           └────┬────┘
                ↓
┌─────────────────────────────────┐
│        返回结果/继续执行          │
└─────────────────────────────────┘
```

## 创建 Agent

### 基本 Agent

在 `CLAUDE.md` 中定义：

```markdown
# Project Name: MyProject

[default]
role: 你是一个经验丰富的全栈工程师
expertise:
  - TypeScript
  - React
  - Node.js
  - 数据库设计
workingStyle:
  - 先理解需求
  - 制定计划
  - 逐步执行
  - 验证结果
```

### 专业 Agent

```markdown
# 高级 Agent 配置

[specialist:code-reviewer]
role: 专业的代码审查员
focus:
  - 代码质量
  - 性能问题
  - 安全漏洞
  - 代码风格
reviewCriteria:
  - SOLID 原则
  - DRY 原则
  - 安全性检查
  - 性能考虑

[specialist:backend-dev]
role: 后端开发专家
expertise:
  - RESTful API
  - GraphQL
  - 数据库
  - 认证授权
  - 微服务架构
```

## Agent 类型

### 1. 全能型 Agent

```markdown
[agent:fullstack]
name: 全栈开发者
role: 经验丰富的全栈开发工程师
capabilities:
  - 前端开发 (React, Vue, Angular)
  - 后端开发 (Node.js, Python, Go)
  - 数据库设计
  - API 设计与实现
  - 部署与运维
style:
  - 遵循最佳实践
  - 编写可维护代码
  - 注重代码质量
```

### 2. 专家型 Agent

```markdown
[agent:security-expert]
name: 安全专家
role: 网络安全专家
focus:
  - 漏洞检测
  - 安全加固
  - 加密实现
  - 权限控制
tools:
  - 安全扫描工具
  - 依赖检查
  - 代码审计
```

### 3. 辅助型 Agent

```markdown
[agent:helper]
name: 项目助手
role: 友好的项目助手
abilities:
  - 解答问题
  - 提供建议
  - 查找文档
  - 解释代码
  - 教学指导
```

## Agent 指令系统

### 角色定义 (role)

```markdown
role: |
  你是一个专业的 [职业角色]
  拥有 [年数] 年的 [领域] 经验
  专注于 [具体方向]
```

### 专业领域 (expertise)

```markdown
expertise:
  - 精通 [技术1] 和 [技术2]
  - 熟悉 [技术3]
  - 了解 [技术4]
```

### 工作方式 (workingStyle)

```markdown
workingStyle:
  approach: |
    解决问题的方式：
    1. 先理解问题本质
    2. 分析可选方案
    3. 选择最佳方案
    4. 实施并验证

  communication: |
    沟通方式：
    - 清晰简洁
    - 提供多个选项
    - 解释决策理由
```

### 约束条件 (constraints)

```markdown
constraints:
  - 必须遵循项目的代码规范
  - 不修改未经授权的代码
  - 执行危险操作前必须确认
  - 保持代码风格一致
```

## Agent 协作

### 主 Agent + 辅助 Agent

```
用户请求
    ↓
[主 Agent: 架构师]
    ↓ 分析 → 制定方案
    ↓
[辅助 Agent 1: 前端专家]  [辅助 Agent 2: 后端专家]
    ↓                    ↓
   前端方案              后端方案
    ↓                    ↓
    └────────┬───────────┘
             ↓
    [主 Agent: 整合方案]
             ↓
         最终方案
```

### Agent 通信

```markdown
[agent:team-lead]
name: 技术负责人
role: 技术团队负责人
coordination: |
  当收到任务时：
  1. 分析任务类型
  2. 调用相应专家 Agent
  3. 整合专家建议
  4. 输出最终方案

team:
  - code-reviewer: 代码审查
  - backend-dev: 后端开发
  - frontend-dev: 前端开发
  - security-expert: 安全审查
```

## Agent 工具配置

### 启用/禁用工具

```markdown
[agent:restricted-dev]
role: 受限开发者
allowedTools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep

deniedTools:
  - Bash
  - Write (禁止覆盖)
```

### 工具参数限制

```markdown
[agent:safe-dev]
role: 安全开发者
toolLimits:
  Bash:
    allowedCommands:
      - npm install
      - npm run build
      - npm test
    maxDuration: 300  # 秒
  Write:
    requireConfirmation: true
    allowedPaths:
      - /src/
      - /tests/
```

## Agent 学习与适应

### 基于反馈调整

```
用户反馈 → Agent 分析 → 调整策略 → 改进输出
```

### 记忆系统集成

```markdown
[agent:smart-assistant]
role: 智能助手
memory:
  projectContext: true    # 记住项目上下文
  userPreferences: true   # 记住用户偏好
  codePatterns: true      # 记住代码模式
```

## 实际应用示例

### 示例 1：代码审查 Agent

```markdown
# CLAUDE.md

[agent:code-reviewer]
name: 代码审查助手
role: 专业的代码审查专家
focus: |
  专注于以下方面：
  1. 代码质量和可读性
  2. 性能优化建议
  3. 安全漏洞检测
  4. 测试覆盖率
  5. 错误处理完整性

reviewSteps: |
  1. 理解代码功能
  2. 分析代码结构
  3. 检查潜在问题
  4. 评估性能影响
  5. 提出改进建议

outputFormat: |
  ## 审查结果

  ### 总体评分: X/10

  ### 优点
  - ...

  ### 问题
  - [严重] ...
  - [中等] ...
  - [轻微] ...

  ### 建议
  - ...

  ### 总结
  ...
```

使用：

```
请代码审查员审查 src/auth/login.ts
```

### 示例 2：数据库设计 Agent

```markdown
[agent:db-designer]
name: 数据库设计专家
role: 数据库架构师
expertise:
  - 关系型数据库设计
  - NoSQL 数据库
  - 数据建模
  - 性能优化
  - 数据迁移

designPrinciples: |
  1. 第三范式 (3NF)
  2. 适当的数据冗余
  3. 索引优化
  4. 分区策略

outputFormat: |
  ## 数据库设计

  ### ER 图
  [实体关系图]

  ### 表结构
  | 表名 | 字段 | 类型 | 约束 |
  |------|------|------|------|
  | ...  | ...  | ...  | ...  |

  ### 索引设计
  ...

  ### SQL 脚本
  ```sql
  CREATE TABLE ...
  ```
```

### 示例 3：API 设计 Agent

```markdown
[agent:api-designer]
name: API 设计专家
role: API 架构师
standards:
  - RESTful 规范
  - OpenAPI 3.0
  - JSON:API
  - GraphQL 最佳实践

restGuidelines: |
  - 使用标准 HTTP 方法
  - 合理的 URL 结构
  - 版本控制策略
  - 错误处理规范
  - 分页和过滤
```

## Agent 最佳实践

### 1. 单一职责原则

```
✅ 每个 Agent 专注于一个领域
❌ 不要创建一个"什么都能做"的 Agent
```

### 2. 清晰的指令

```
✅ role 描述清晰明确
❌ "你是一个有用的助手"
```

### 3. 适当的约束

```
✅ 设置合理的工具限制
❌ 完全开放所有权限
```

### 4. 渐进式开发

```
1. 从简单 Agent 开始
2. 根据使用反馈调整
3. 逐步添加复杂功能
```

### 5. 文档化

```
✅ 为每个 Agent 编写使用说明
✅ 记录特殊配置和要求
```

## Agent 性能优化

### 1. 减少上下文

```markdown
# 只加载相关工具
[agent:simple-task]
tools: [Read, Write]

# 相比之下更复杂
[agent:complex-task]
tools: [Read, Write, Edit, Bash, Glob, Grep, ...]
```

### 2. 专门化 vs 通用化

```
专门化 Agent：
- 更快
- 更准确
- 需要更多 Agent

通用化 Agent：
- 更灵活
- 可能不够精确
- 维护简单
```

### 3. 缓存结果

```
常用计算结果 → 缓存 → 快速复用
```

## 调试 Agent

### 查看 Agent 思考

Claude Code 会显示 Agent 的思考过程：

```
我需要完成这个任务：
1. 理解当前代码状态
2. 分析需要修改的部分
3. 制定修改计划
4. 执行修改
5. 验证结果
```

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Agent 偏离主题 | 指令不够明确 | 添加更具体的约束 |
| Agent 工具调用过多 | 任务分解不当 | 分步骤执行 |
| Agent 输出不准确 | 专业度不足 | 提供更多示例 |
| Agent 行为不一致 | 配置混乱 | 简化 Agent 定义 |

::: tip 实践建议
从简单的 Agent 开始，逐步增加复杂性。记录每个 Agent 的表现，持续优化配置。
:::
