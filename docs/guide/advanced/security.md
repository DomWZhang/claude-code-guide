# 安全审计：用 Claude Code 保护代码库

本章介绍如何使用 Claude Code 和相关工具（特别是 AgentShield）进行安全审计，包括漏洞扫描、密钥检测、依赖分析和配置审查。

## 安全审计维度

| 维度 | 检查内容 | 工具/方法 |
|------|----------|-----------|
| 密钥泄露 | 硬编码 API Key、密码、Token | AgentShield、Grep 模式 |
| 代码注入 | SQL 注入、XSS、命令注入 | Claude Code 规则、语义分析 |
| 依赖漏洞 | 已知 CVE、过期包 | npm audit、Claude 分析 |
| 配置风险 | 过度权限、调试模式 | 配置审查规则 |
| MCP 安全 | 外部服务权限、数据暴露 | AgentShield MCP 扫描 |
| Hook 安全 | 恶意脚本、权限绕过 | Hook 审计 |

## AgentShield：专用安全扫描器

AgentShield 是 Everything Claude Code 生态中的安全审计工具，拥有 102 条静态分析规则和 1282 个测试。

### 安装

```bash
# 全局安装
npm install -g ecc-agentshield

# 或使用 npx（无需安装）
npx ecc-agentshield --help
```

### 基础扫描

```bash
# 快速扫描当前目录
npx ecc-agentshield scan

# 扫描特定目录
npx ecc-agentshield scan ./src

# 输出 JSON 格式（CI 集成）
npx ecc-agentshield scan --json

# 自动修复可自动修复的问题
npx ecc-agentshield scan --fix
```

### 深度扫描（三 Agent 对抗）

AgentShield 的 `--opus` 模式启动三个 Claude Opus 4.6 Agent：

1. **红队 Agent**：寻找攻击链
2. **蓝队 Agent**：评估防御措施
3. **审计 Agent**：综合双方输出，生成优先级风险报告

```bash
# 运行三 Agent 深度扫描
npx ecc-agentshield scan --opus --stream

# 输出 HTML 报告
npx ecc-agentshield scan --opus --format html --output report.html
```

### AgentShield 扫描规则示例

| 规则类别 | 规则数量 | 示例 |
|----------|----------|------|
| 密钥检测 | 14 模式 | `sk-*`, `ghp_*`, `AKIA*` |
| 权限审计 | 12 规则 | 过度文件权限、危险 Bash 命令 |
| Hook 注入 | 8 规则 | 未验证的 hook 脚本 |
| MCP 风险 | 10 规则 | 未认证的 MCP 服务 |
| Agent 配置 | 6 规则 | 权限过大的 subagent |
| 代码注入 | 52 规则 | SQL、XSS、命令注入模式 |

## 手动安全审计（无 AgentShield）

### 密钥扫描

```bash
# 使用 Claude Code 扫描
claude -p "扫描项目中的硬编码密钥：
查找以下模式：
- API_KEY = '...'
- password = '...'
- secret = '...'
- token = '...'
- 任何看起来像密钥的长字符串
输出文件路径和行号"
```

### 依赖漏洞检查

```bash
claude -p "分析 package.json 和 package-lock.json：
1. 检查过时的依赖
2. 查找已知漏洞（参考 npm audit 输出）
3. 建议升级版本
输出表格格式"
```

### SQL 注入检测

```bash
claude -p "在 src/ 目录下查找潜在的 SQL 注入风险：
重点关注：
- 字符串拼接的 SQL 查询
- 未使用参数化查询的地方
- 动态表名/列名
输出风险评估"
```

### XSS 漏洞检测

```bash
claude -p "检查 React/TypeScript 代码中的 XSS 风险：
- dangerouslySetInnerHTML 的使用
- innerHTML 直接赋值
- 未转义的用户输入
输出每个风险点的位置和严重程度"
```

## 配置审计

### 检查 settings.json

```bash
claude -p "审查 ~/.claude/settings.json：
1. 是否有过度宽松的权限
2. 是否启用了不必要的 MCP
3. 是否有危险的 hook 配置
4. 模型选择是否合理（成本/安全平衡）
输出改进建议"
```

### 检查 CLAUDE.md

```bash
claude -p "审查项目 CLAUDE.md：
1. 是否暴露了敏感信息
2. 是否有危险的默认行为
3. 工具权限是否过大
输出安全评估"
```

## Everything Claude Code 安全特性

ECC 内置了多层安全防护：

### 1. 危险命令拦截

```json
// hooks/hooks.json 中的 PreToolUse hook
{
  "matcher": "tool == \"Bash\" && (tool_input.command contains \"rm -rf\" || tool_input.command contains \"git push --force\")",
  "hooks": [{
    "type": "command",
    "command": "echo '危险命令被拦截' && exit 1"
  }]
}
```

### 2. MCP 服务器风险分级

| 风险等级 | 类型 | 处理方式 |
|----------|------|----------|
| 低 | 只读 MCP（如 Context7） | 允许 |
| 中 | 写入 MCP（如 GitHub） | 需确认 |
| 高 | 执行 MCP（如 Bash） | 需显式批准 |

### 3. 密钥检测 Hooks

ECC 的 `pre-submit-prompt` hook 会在用户提交消息前检测密钥：

```bash
# 检测到密钥时阻止提交
if grep -E "(sk-[a-zA-Z0-9]+|ghp_[a-zA-Z0-9]+)" <<< "$message"; then
  echo "❌ 检测到 API Key，请移除后再试"
  exit 1
fi
```

## CI/CD 安全集成

### GitHub Actions 安全扫描

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: AgentShield Scan
        run: |
          npx ecc-agentshield scan --json --output shield-report.json

      - name: Claude Code Security Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "执行安全审计，重点关注：
          - 认证授权逻辑
          - 输入验证
          - 加密实现
          输出到 security-review.md"

      - name: Upload Reports
        uses: actions/upload-artifact@v4
        with:
          name: security-reports
          path: |
            shield-report.json
            security-review.md

      - name: Block on Critical
        if: contains(github.event.inputs.severity, 'critical')
        run: exit 1
```

### GitLab CI 安全门禁

```yaml
security-gate:
  stage: security
  script:
    - npx ecc-agentshield scan --threshold 80
    - if [ $? -ne 0 ]; then exit 1; fi
  only:
    - merge_requests
```

## 安全最佳实践清单

### 日常开发

- [ ] 使用 AgentShield 定期扫描（至少每周一次）
- [ ] 启用 ECC 的危险命令拦截 Hook
- [ ] 不在 CLAUDE.md 中存储密钥
- [ ] 使用环境变量传递敏感信息

### 团队协作

- [ ] 将 AgentShield 扫描纳入 CI/CD
- [ ] 安全扫描结果作为 PR 合并的必要条件
- [ ] 定期审查 MCP 服务器权限
- [ ] 审计 Hook 脚本内容

### 高级防护

- [ ] 启用 `--opus` 深度扫描模式（关键项目）
- [ ] 配置安全阈值，低于阈值自动阻断
- [ ] 集成 Slack 等通知，实时告警
- [ ] 建立安全事件响应流程

## 常见安全问题与修复

| 问题 | 检测方式 | 修复建议 |
|------|----------|----------|
| 硬编码密钥 | AgentShield 密钥模式 | 移至环境变量或密钥管理服务 |
| SQL 注入 | 语义分析 | 使用参数化查询或 ORM |
| XSS 漏洞 | 模式匹配 | 使用 DOMPurify 或框架内置转义 |
| 危险命令 | Hook 拦截 | 使用白名单允许的命令 |
| 过度权限 | 权限审计 | 限制工具和文件访问范围 |

## 故障排除

### AgentShield 扫描失败

```bash
# 检查 Node.js 版本（需要 18+）
node --version

# 重新安装
npm uninstall -g ecc-agentshield
npm install -g ecc-agentshield

# 查看详细日志
DEBUG=agentshield* npx ecc-agentshield scan
```

### 误报处理

在 `.agentshieldignore` 中添加排除规则：

```
# 排除测试文件中的密钥模式
tests/**/*.test.ts

# 排除示例代码
examples/**
```

## 总结

| 工具/方法 | 用途 | 频率 |
|-----------|------|------|
| AgentShield 快速扫描 | 日常安全检查 | 每次提交 |
| AgentShield --opus | 深度安全审计 | 每周/发布前 |
| Claude Code 手动审计 | 特定场景深度分析 | 按需 |
| CI/CD 安全门禁 | 自动化阻断 | 每次 PR |

**核心原则**：安全审计不是一次性工作，而是持续过程。结合 AgentShield 的自动化和 Claude Code 的深度分析，构建完整的安全防护体系。
