# 自定义工作流：构建专属自动化流水线

本章介绍如何利用 Claude Code 的 Rules、Hooks、Agents 和 MCP 构建自定义工作流，将重复性任务自动化，打造适合团队和个人习惯的开发流程。

## 工作流设计原则

| 原则 | 说明 | 反例 |
|------|------|------|
| 单一职责 | 每个工作流只做一件事 | 一个工作流既做代码审查又做部署 |
| 可组合 | 工作流可串联/并联 | 硬编码依赖，无法复用 |
| 可观测 | 每个步骤有日志和状态 | 黑盒执行，无法调试 |
| 安全边界 | 危险操作需确认 | 自动执行 rm -rf |

## 工作流类型

### 1. 代码质量工作流

**目标**：提交前自动检查代码质量

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"git commit\"",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/workflows/pre-commit.sh"
          }
        ]
      }
    ]
  }
}
```

**pre-commit.sh**：

```bash
#!/bin/bash
echo "🔍 运行提交前检查..."

# 1. 格式化
npx prettier --write .

# 2. Lint
npx eslint . --fix

# 3. 类型检查
npx tsc --noEmit

# 4. 运行相关测试
npm test -- --changedSince=HEAD

if [ $? -ne 0 ]; then
  echo "❌ 测试失败，提交被阻止"
  exit 1
fi

echo "✅ 所有检查通过"
```

### 2. PR 审查工作流

**目标**：自动审查 PR 并添加评论

```yaml
# .github/workflows/claude-pr-review.yml
name: PR Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Claude Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "
            审查以下 PR 变更。
            输出格式：Markdown
            包含：
            - 总体评分 (1-10)
            - 关键问题（按严重程度）
            - 改进建议
            - 测试建议
          " > review.md
      
      - name: Post Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🤖 Claude Code 审查结果\n\n${review}`
            });
```

### 3. 文档生成工作流

**目标**：代码变更后自动更新文档

```markdown
# .claude/workflows/docs-generator.md

[workflow:generate-docs]
name: API 文档生成器

trigger:
  - event: file_change
    pattern: "src/api/**/*.ts"

actions:
  - name: 分析变更
    agent: doc-updater
    prompt: |
      分析 src/api/ 目录下的变更，
      提取新增/修改的 API 端点
  
  - name: 生成文档
    command: |
      cat analysis.json | \
      claude -p "基于以下 API 变更生成 OpenAPI 规范" \
      > openapi.yaml
  
  - name: 提交文档
    command: |
      git add docs/api/
      git commit -m "docs: 自动更新 API 文档" || true
```

## Everything Claude Code 工作流

ECC 提供了大量预置工作流，可直接使用或定制。

### 安装 ECC 工作流

```bash
# 克隆 ECC 仓库
git clone https://github.com/affaan-m/everything-claude-code.git

# 复制工作流配置
cp -r everything-claude-code/.claude/workflows/ .claude/
```

### ECC 核心工作流

| 工作流 | 命令 | 功能 |
|--------|------|------|
| TDD 工作流 | `/tdd` | 红灯→绿灯→重构循环 |
| 验证循环 | `/verify` | 构建→测试→lint→类型检查 |
| 战略压缩 | `/strategic-compact` | 智能上下文压缩 |
| 安全检查 | `/security-scan` | 完整安全审计 |
| 代码清理 | `/refactor-clean` | 死代码检测与删除 |
| 性能审计 | `/performance-audit` | 性能瓶颈分析 |

### 使用 ECC 工作流

```bash
# 启动 TDD 工作流
/tdd "添加用户注册功能"

# 运行验证循环
/verify

# 执行安全扫描
/security-scan --depth full

# 清理代码
/refactor-clean --dry-run  # 预览
/refactor-clean --apply    # 执行
```

## 自定义 Agent 工作流

### 创建专用 Agent

```markdown
# .claude/agents/db-migrator.md
---
name: db-migrator
description: 数据库迁移专家
tools: ["Read", "Write", "Bash", "Grep"]
model: sonnet
---

你是数据库迁移专家。收到迁移需求后：

1. 分析现有 schema
2. 生成迁移脚本（up/down）
3. 验证迁移安全性
4. 输出回滚方案

输出格式：
- 迁移脚本：migrations/XXX_<name>.sql
- 回滚脚本：migrations/XXX_<name>_down.sql
- 风险评估：低/中/高
```

### 编排工作流

```yaml
# .claude/workflows/db-migration.yaml
name: 数据库迁移工作流

stages:
  - name: 分析
    agent: db-migrator
    prompt: "分析 schema 变更需求：{{ description }}"
    output: analysis.json
  
  - name: 生成
    agent: db-migrator
    prompt: "基于 analysis.json 生成迁移脚本"
    output: migrations/
  
  - name: 验证
    command: |
      for file in migrations/*.sql; do
        psql -f $file --dry-run
      done
  
  - name: 应用（需确认）
    prompt: "是否应用迁移？"
    on_confirm:
      command: |
        for file in migrations/*.sql; do
          psql -f $file
        done
```

## MCP 集成工作流

### GitHub + Slack 工作流

```json
// .claude/mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": { "GITHUB_TOKEN": "xxx" }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": { "SLACK_BOT_TOKEN": "xxx" }
    }
  }
}
```

**工作流**：PR 创建 → 自动审查 → 发送 Slack 通知

```markdown
[workflow:pr-notify]
trigger:
  event: github.pull_request.opened

actions:
  - name: 审查代码
    agent: code-reviewer
    prompt: "审查 PR #{{ pr.number }}"
  
  - name: 发送通知
    mcp: slack
    method: post_message
    params:
      channel: "#code-review"
      text: |
        新 PR: {{ pr.title }}
        作者: {{ pr.author }}
        审查结果: {{ review.summary }}
```

## 定时工作流

### 每日安全扫描

```bash
# 使用 cron 或系统定时任务
# crontab -e
0 2 * * * cd /project && claude -p "执行安全扫描，输出到 /reports/security-$(date +\%Y\%m\%d).md"
```

### ECC 定时任务

```bash
# 使用 ECC 的 loop 命令
/loop 24h "运行完整测试套件并生成覆盖率报告"

# 查看循环状态
/loop-status

# 停止循环
/task stop loop-xxx
```

## 实战案例：自动化发布工作流

```yaml
# .claude/workflows/release.yaml
name: 自动化发布

stages:
  - name: version
    description: 版本号管理
    command: |
      # 自动递增版本号
      npm version patch --no-git-tag-version
      VERSION=$(node -p "require('./package.json').version")
      echo "VERSION=$VERSION" >> $GITHUB_ENV
  
  - name: test
    description: 运行测试
    command: |
      npm run lint
      npm run type-check
      npm run test:coverage
    threshold:
      coverage: 80
  
  - name: build
    description: 构建
    command: npm run build
  
  - name: security
    description: 安全扫描
    agent: security-reviewer
    prompt: "扫描构建产物"
    on_fail: abort
  
  - name: changelog
    description: 更新日志
    command: |
      claude -p "基于 git log 生成 CHANGELOG.md"
  
  - name: commit
    description: 提交
    command: |
      git add .
      git commit -m "chore: release v$VERSION"
      git tag "v$VERSION"
  
  - name: deploy
    description: 部署
    command: npm run deploy
    require_confirm: true
  
  - name: notify
    description: 通知
    mcp: slack
    method: post_message
    params:
      channel: "#releases"
      text: "✅ v$VERSION 已发布"
```

## 工作流调试

### 查看工作流状态

```bash
# 查看当前工作流
/workflow status

# 查看工作流日志
/workflow logs --tail 50

# 重试失败的步骤
/workflow retry --step <step-id>
```

### 调试技巧

| 问题 | 调试方法 |
|------|----------|
| 工作流不触发 | 检查 trigger 条件 |
| 步骤失败 | 查看错误日志，单独执行该步骤 |
| 上下文丢失 | 在步骤间显式传递输出 |
| 权限不足 | 检查 MCP 和工具权限 |

## 工作流共享

### 导出工作流

```bash
# 导出工作流配置
claude -p "导出当前工作流配置为 YAML" > workflow.yaml

# 分享给团队
git add .claude/workflows/
git commit -m "chore: 添加团队工作流"
```

### 导入工作流

```bash
# 从 ECC 导入
cp -r everything-claude-code/.claude/workflows/* .claude/workflows/

# 从团队仓库导入
git pull origin workflows
```

## 最佳实践

1. **从简单开始**：先实现单个步骤，再扩展为完整工作流
2. **幂等性**：工作流应可重复执行，不产生副作用
3. **可观测性**：每个步骤输出日志和状态
4. **安全第一**：破坏性操作需确认
5. **文档化**：为每个工作流编写使用说明

## 总结

| 工作流类型 | 工具 | 复杂度 |
|-----------|------|--------|
| 代码质量 | Hooks + Scripts | 低 |
| PR 审查 | GitHub Actions + Claude | 中 |
| 数据库迁移 | Custom Agent | 中 |
| 自动化发布 | ECC Workflows | 高 |

自定义工作流的核心是识别重复模式，用 Claude Code 的能力自动化执行，让开发者专注于创造性工作。
