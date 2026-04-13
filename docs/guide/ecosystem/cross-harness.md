# Cross-Harness 支持：跨平台使用 Claude Code 生态

Cross-Harness 是 Everything Claude Code 生态中的跨平台适配层，让 ECC 的 agents、rules、hooks、skills 等资产可以在多个 AI 编码工具之间无缝迁移和共享。目前支持 Claude Code、Cursor IDE、Codex CLI、OpenCode、Antigravity 和 Gemini CLI。

## 支持的平台矩阵

| 平台 | Agents | Rules | Hooks | Skills | MCP | 版本要求 |
|------|--------|-------|-------|--------|-----|---------|
| **Claude Code** | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ 完整 | v1.0+ |
| **Cursor IDE** | ✅ 完整 | ✅ 完整 | ⚠️ 部分 | ✅ 完整 | ✅ 完整 | v0.40+ |
| **Codex CLI** | ⚠️ 基础 | ✅ 完整 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | v1.0+ |
| **OpenCode** | ⚠️ 基础 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | ✅ 完整 | v0.5+ |
| **Antigravity** | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ 完整 | 最新 |
| **Gemini CLI** | ⚠️ 基础 | ✅ 完整 | ⚠️ 部分 | ⚠️ 部分 | ⚠️ 部分 | v0.3+ |

> ✅ 完整支持 / ⚠️ 部分支持（功能受限）

## 安装与配置

### 自动安装（推荐）

```bash
# 从 ECC 仓库安装
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code

# 自动检测并安装到所有支持的平台
./install.sh --cross-harness --profile full

# 或选择性安装
./install.sh --cross-harness --targets cursor,codex typescript
```

### 手动安装

```bash
# 1. 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git

# 2. 安装到 Claude Code（默认）
cp -r ecc/assets/* ~/.claude/

# 3. 安装到 Cursor IDE
mkdir -p ~/.cursor/
cp -r ecc/assets/* ~/.cursor/

# 4. 安装到 Codex CLI
mkdir -p ~/.codex/
cp -r ecc/assets/* ~/.codex/
```

## 同步策略

### 选择性同步

由于不同平台的能力不同，Cross-Harness 支持选择性同步：

```bash
# 只同步 rules（所有平台都支持）
./sync.sh --assets rules

# 同步 rules + agents
./sync.sh --assets rules,agents

# 同步所有资产
./sync.sh --assets all

# 指定目标平台
./sync.sh --targets cursor --assets rules,agents
```

### 同步配置文件

```yaml
# .ecc-cross-harness.yaml
targets:
  - cursor
  - codex
  - opencode

assets:
  rules:
    - common
    - typescript
    - python
  agents:
    - planner
    - code-reviewer
    - security-reviewer
  hooks:
    - pre-tool-use
    - post-tool-use
    - session-end
  skills:
    - tdd-workflow
    - verification-loop

conflict_resolution: prompt  # prompt | overwrite | skip
```

## 平台特定配置

### Cursor IDE

```bash
# 安装到 Cursor
./install.sh --target cursor typescript

# Cursor 特定配置
# 文件位置: ~/.cursor/rules/, ~/.cursor/agents/
```

### Codex CLI

```bash
# 安装到 Codex
./install.sh --target codex typescript

# Codex MCP 配置
# 文件位置: ~/.codex/mcp.json
```

### OpenCode

```bash
# OpenCode 自动检测
opencode
# 自动读取 ~/.opencode/opencode.json
```

### Antigravity

```bash
# Antigravity 原生支持 ECC 格式
./install.sh --target antigravity full
```

### Gemini CLI

```bash
# Gemini CLI 需要格式转换
./install.sh --target gemini --profile full

# Gemini 可能需要格式转换
# ECC agents → Gemini format
# ECC skills → Gemini prompts
```

## 冲突处理

当多个平台同时存在相同资产时：

```yaml
# .ecc-cross-harness.yaml
conflict_resolution: prompt  # 三种策略

# overwrite: 直接覆盖
# skip: 跳过，不更新
# prompt: 询问用户
```

### 查看冲突

```bash
# 列出所有冲突
ecc-cross list --conflicts

# 查看冲突详情
ecc-cross diff --asset rules/typescript/coding-style.md

# 解决冲突
ecc-cross resolve --asset rules/typescript/coding-style.md --strategy overwrite
```

## 版本管理

### 同步版本追踪

```bash
# 查看同步历史
ecc-cross history

# 输出示例：
# 2024-01-15 10:30: Synced rules/typescript to cursor (v1.2.0)
# 2024-01-14 15:20: Synced agents/* to codex (v1.2.0)
# 2024-01-13 09:00: Synced skills/ to all platforms (v1.1.0)
```

### 回滚

```bash
# 回滚到指定版本
ecc-cross rollback --target cursor --version 1.1.0

# 回滚所有平台
ecc-cross rollback --all --version 1.0.0
```

## 实战：从 Claude Code 迁移到 Cursor

### 场景

你已经在 Claude Code 上配置了完整的 ECC 环境，现在想在 Cursor IDE 中使用相同的配置。

### 步骤

```bash
# 1. 导出 Claude Code 配置
ecc-cross export --output ./my-config/

# 2. 在 Cursor 中安装 Cross-Harness
./install.sh --target cursor

# 3. 导入配置到 Cursor
ecc-cross import --target cursor --from ./my-config/

# 4. 验证
cursor  # 在 Cursor 中验证 agents、rules 是否生效
```

### 验证清单

- [ ] `/rules` 显示 Claude Code 相同的规则
- [ ] agents 列表与 Claude Code 一致
- [ ] Hooks 正常工作
- [ ] Skills 可用（如平台支持）

## 限制与注意事项

### 平台限制

| 平台 | 不支持的功能 |
|------|-------------|
| Codex | Agents 子系统、自定义 hook 类型 |
| Gemini CLI | Agents、复杂 hooks |
| OpenCode | Skills、某些 MCP 服务器 |

### 格式差异

不同平台对相同资产可能有不同的格式要求：

```
Claude Code agents    → Markdown 格式
Cursor agents         → JSON 格式（需要转换）
Codex agents          → YAML 格式（需要转换）
```

Cross-Harness 会自动处理格式转换，但某些高级特性可能在转换中丢失。

### 安全注意事项

- 不同平台的安全模型不同，某些规则可能需要调整
- MCP 服务器的权限设置需要针对每个平台单独配置
- API Key 的存储方式因平台而异

## 维护

### 更新同步

```bash
# 检查更新
ecc-cross check-update

# 更新到最新版本
ecc-cross update

# 更新特定平台
ecc-cross update --target cursor
```

### 清理

```bash
# 清理过期的备份
ecc-cross clean

# 卸载特定平台
ecc-cross uninstall --target codex
```

## 最佳实践

1. **集中管理**：在 Claude Code 中维护所有资产，通过 Cross-Harness 分发
2. **定期同步**：每次更新 ECC 后，执行 `sync.sh` 保持各平台一致
3. **测试验证**：在每个目标平台上验证同步后的资产是否正常
4. **版本锁定**：在生产环境中锁定版本，避免自动更新导致不一致
5. **冲突记录**：记录冲突解决策略，形成团队规范

## 资源链接

- [ECC GitHub](https://github.com/affaan-m/everything-claude-code)
- [Cross-Harness 文档](https://github.com/affaan-m/everything-claude-code#cross-harness)

::: tip
Cross-Harness 是团队标准化 AI 编码工作流的利器。建议在团队中指定一个平台作为"主平台"，其他平台通过 Cross-Harness 同步配置。
:::
