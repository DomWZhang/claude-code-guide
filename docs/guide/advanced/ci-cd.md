# CI/CD 集成：将 Claude Code 纳入自动化流水线

本章介绍如何将 Claude Code 集成到 CI/CD 流水线中，实现自动化代码审查、测试生成、文档更新等任务。

## 集成架构

### 基础模式

```
代码提交 → CI 触发 → Claude Code 执行 → 结果输出 → 后续步骤
```

### 典型场景

| 场景 | 触发时机 | Claude Code 任务 | 输出 |
|------|----------|------------------|------|
| 代码审查 | PR 创建 | 审查代码变更 | 评论到 PR |
| 测试生成 | PR 合并前 | 为新增代码生成测试 | 提交测试文件 |
| 文档更新 | 代码合并后 | 更新 API 文档 | PR 到 docs 仓库 |
| 安全扫描 | 每日定时 | 扫描依赖漏洞 | 生成报告 |
| 重构建议 | 定期 | 分析代码质量 | 创建 Issue |

## GitHub Actions 集成

### 基础配置

```yaml
# .github/workflows/claude-code-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # 获取完整历史

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Claude Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "审查这个 PR 的代码变更。
          重点关注：
          1. 类型安全
          2. 错误处理
          3. 性能影响
          4. 安全漏洞
          输出格式：Markdown 表格"

      - name: Post comment to PR
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Claude Code 审查结果\n\n${review}`
            });
```

### 高级：自动修复问题

```yaml
name: Claude Code Auto Fix

on:
  pull_request:
    types: [labeled]
    labels: [auto-fix]

jobs:
  auto-fix:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }}

      - name: Install dependencies
        run: npm ci

      - name: Run Claude Code Fix
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "修复当前代码中的所有 ESLint 错误和 TypeScript 类型错误。
          不要改变功能逻辑。修复后运行 npm run lint 和 npm run type-check 验证。"

      - name: Commit fixes
        run: |
          git config user.name "claude-code[bot]"
          git config user.email "claude-code[bot]@users.noreply.github.com"
          git add .
          git diff --staged --quiet || git commit -m "fix: auto-fix by Claude Code"
          git push
```

## GitLab CI 集成

```yaml
# .gitlab-ci.yml
claude-code-review:
  stage: review
  image: node:20
  only:
    - merge_requests
  before_script:
    - npm install -g @anthropic-ai/claude-code
  script:
    - |
      claude -p "审查本次 MR 的变更。
      项目：$CI_PROJECT_NAME
      分支：$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME
      目标：$CI_MERGE_REQUEST_TARGET_BRANCH_NAME
      输出 JSON 格式的审查结果到 review.json"
    - cat review.json
  artifacts:
    paths:
      - review.json
    reports:
      codequality: review.json
```

## Jenkins Pipeline 集成

```groovy
pipeline {
    agent any
    
    environment {
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Claude Code Analysis') {
            steps {
                sh '''
                    npx @anthropic-ai/claude-code -p "
                        分析 src/ 目录下的代码质量。
                        输出报告到 analysis.md
                    "
                '''
            }
        }
        
        stage('Generate Report') {
            steps {
                publishHTML([
                    reportDir: '.',
                    reportFiles: 'analysis.md',
                    reportName: 'Claude Code Analysis'
                ])
            }
        }
    }
}
```

## 预提交钩子（Pre-commit）

### 安装 pre-commit

```bash
pip install pre-commit
```

### 配置 .pre-commit-config.yaml

```yaml
repos:
  - repo: local
    hooks:
      - id: claude-code-lint
        name: Claude Code Lint
        entry: claude -p "检查代码格式和类型错误，不要修改文件，只输出问题列表"
        language: system
        files: \.(ts|tsx|js|jsx)$
        pass_filenames: true
        verbose: true

      - id: claude-code-security
        name: Claude Code Security
        entry: claude -p "检查以下文件的安全漏洞：{filenames}。输出严重级别排序的问题列表。"
        language: system
        files: \.(ts|tsx|js|jsx|py|go)$
```

### 使用 lint-staged 集成

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "claude -p \"修复以下文件的 ESLint 错误，不要改变逻辑：{filenames}\"",
      "git add"
    ],
    "*.{js,ts}": [
      "claude -p \"为以下文件生成单元测试：{filenames}\"",
      "npm test -- --findRelatedTests"
    ]
  }
}
```

## 定时任务（Cron）

### GitHub Actions Cron

```yaml
name: Daily Security Scan

on:
  schedule:
    - cron: '0 2 * * *'  # 每天 UTC 2:00

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Claude Code Security Audit
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "执行完整的安全审计：
          1. 检查 package.json 中的已知漏洞
          2. 扫描硬编码密钥
          3. 检查 SQL 注入风险
          4. 检查 XSS 漏洞
          输出详细报告到 security-report.md"

      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: security-report.md

      - name: Notify on critical issues
        if: contains(github.event.inputs.severity, 'critical')
        run: |
          # 发送到 Slack
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"Claude Code 发现严重安全漏洞"}' \
            ${{ secrets.SLACK_WEBHOOK }}
```

## 与 Everything Claude Code 集成

ECC 提供了专门的 CI/CD 工具和配置。

### 安装 ECC CLI

```bash
npm install -g ecc-universal
```

### 使用 ECC 进行 CI 审查

```yaml
# .github/workflows/ecc-review.yml
name: ECC Review

jobs:
  ecc-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install ECC
        run: npm install -g ecc-universal

      - name: Run ECC Security Scan
        run: ecc-agentshield scan --json --output report.json

      - name: Run ECC Quality Gate
        run: |
          ecc quality-gate --threshold 80
          # 如果质量分数低于 80，退出码非 0

      - name: Upload ECC Report
        uses: actions/upload-artifact@v4
        with:
          name: ecc-report
          path: report.json
```

### ECC GitHub App 集成

ECC 提供 GitHub App 实现高级功能：

1. 安装 [ECC Tools](https://github.com/marketplace/ecc-tools)
2. 自动触发 PR 审查
3. 生成技能文件
4. 团队共享 instincts

## 最佳实践

### 1. 限制 Claude Code 权限

```yaml
# 在 CI 中设置只读模式
env:
  CLAUDE_CODE_READONLY: "true"
```

### 2. 缓存 API 响应

```yaml
- name: Cache Claude responses
  uses: actions/cache@v3
  with:
    path: ~/.claude/cache
    key: claude-${{ hashFiles('src/**/*.ts') }}
```

### 3. 超时控制

```bash
# 设置超时
timeout 300 claude -p "分析代码"
```

### 4. 并行执行

```yaml
jobs:
  claude-review:
    strategy:
      matrix:
        dir: [src/api, src/components, src/utils]
    steps:
      - run: claude -p "审查 ${{ matrix.dir }} 目录"
```

### 5. 结果合并

```yaml
- name: Merge reports
  run: |
    cat reviews/*.md > combined-review.md
    claude -p "将 combined-review.md 中的多个审查结果合并为一份摘要"
```

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| API 限流 | 添加重试逻辑，使用 `sleep` |
| 上下文过大 | 分片处理，使用 `/compact` |
| 超时 | 增加 timeout 或拆分任务 |
| 权限不足 | 使用专用 API Key，限制 scope |

## 总结

Claude Code 的 CI/CD 集成核心是**自动化重复任务**：代码审查、测试生成、文档更新、安全扫描。结合 ECC 等生态工具，可以构建完整的自动化质量保障体系。
