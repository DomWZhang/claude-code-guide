# 故障排除

本节收集了 Claude Code 使用过程中常见的问题及其解决方案。

## 启动问题

### 1. 无法启动 Claude Code

**症状**: 运行 `claude` 命令无反应或报错

**可能原因**:
- 未正确安装
- API Key 未配置
- 网络问题

**解决方案**:

```bash
# 1. 检查是否安装
claude --version

# 2. 重新初始化
claude --init

# 3. 配置 API Key
export ANTHROPIC_API_KEY="sk-ant-xxxx"

# 4. 检查网络
curl -I https://api.anthropic.com
```

### 2. 认证失败

**症状**: `Authentication failed` 或 `Invalid API Key`

**解决方案**:

```bash
# 1. 检查 API Key
echo $ANTHROPIC_API_KEY

# 2. 重新设置 API Key
claude --init

# 3. 或手动设置
claude configure set api_key "your-new-key"
```

### 3. 权限被拒绝

**症状**: `Permission denied` 错误

**解决方案**:

```bash
# macOS/Linux
chmod +x /usr/local/bin/claude

# 或重新安装
brew reinstall claude-cli
```

## 连接问题

### 1. API 连接超时

**症状**: `Connection timeout` 或 `Request timeout`

**解决方案**:

```bash
# 1. 检查网络
ping api.anthropic.com

# 2. 配置代理
claude configure set proxy "http://proxy:8080"

# 3. 增加超时时间
claude configure set timeout 120
```

### 2. Rate Limit 错误

**症状**: `Rate limit exceeded`

**解决方案**:
- 等待一段时间后重试
- 升级 Anthropic 计划
- 使用缓存减少请求

## 文件操作问题

### 1. 无法读取文件

**症状**: `File not found` 或 `Permission denied`

**解决方案**:

```bash
# 1. 检查文件是否存在
ls -la /path/to/file

# 2. 检查权限
chmod 644 /path/to/file

# 3. 使用绝对路径
Read({ file_path: "/absolute/path/to/file" })
```

### 2. 无法写入文件

**症状**: `Write failed` 或 `Permission denied`

**解决方案**:

```bash
# 1. 检查目录权限
ls -ld /path/to/directory

# 2. 创建目录（如果不存在）
mkdir -p /path/to/directory

# 3. 修改权限
chmod 755 /path/to/directory
```

### 3. 文件被锁定

**症状**: `File is locked`

**解决方案**:
- 关闭占用文件的程序
- 使用 `lsof` 查找锁定进程
- 等待文件释放

## Git 问题

### 1. Git 命令失败

**症状**: `git: command not found` 或 Git 操作报错

**解决方案**:

```bash
# 1. 检查 Git 安装
git --version

# 2. 配置 Git 用户信息
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 3. 解决冲突
git status
# 手动解决冲突
git add .
git commit -m "resolve conflicts"
```

### 2. 分支冲突

**症状**: `Merge conflict` 或 `Branch already exists`

**解决方案**:

```bash
# 1. 查看分支
git branch -a

# 2. 切换分支
git checkout main
git pull

# 3. 合并或重命名
git branch -m old-branch new-branch
```

### 3. 提交被拒绝

**症状**: `push rejected` 或 `non-fast-forward`

**解决方案**:

```bash
# 方法 1: 拉取并合并
git pull --rebase origin main
git push

# 方法 2: 强制推送（谨慎使用）
git push --force
```

## 上下文问题

### 1. 上下文窗口耗尽

**症状**: Claude 表现异常或忽略部分指令

**解决方案**:

```bash
# 1. 压缩上下文
/compact

# 2. 开始新会话
/new

# 3. 减少加载的文件
# 在 CLAUDE.md 中配置 priorityFiles
```

### 2. 响应不准确

**症状**: Claude 误解需求或提供错误答案

**解决方案**:
- 明确指定文件路径
- 提供更多上下文
- 将任务分解为多个步骤
- 使用 `/clear` 清屏后重新描述

### 3. 上下文加载慢

**症状**: Claude 启动或响应缓慢

**解决方案**:
- 减少上下文中的文件数量
- 使用 `.gitignore` 排除不必要的文件
- 在 `settings.json` 中配置 `excludePatterns`

## 性能问题

### 1. 响应速度慢

**症状**: Claude 生成响应时间长

**可能原因**:
- 网络延迟
- 上下文过大
- 模型负载高

**解决方案**:

```bash
# 1. 检查网络
ping api.anthropic.com

# 2. 减小上下文
/compact

# 3. 使用更快模型
claude configure set model claude-haiku-4-5-20251001
```

### 2. 工具调用慢

**症状**: 文件操作或命令执行慢

**解决方案**:
- 减少并发操作
- 增加超时时间
- 检查系统资源

### 3. 内存占用高

**症状**: Claude 运行占用了大量内存

**解决方案**:
- 减少上下文大小
- 定期压缩上下文
- 关闭不必要的 MCP 服务

## 配置问题

### 1. 配置不生效

**症状**: 修改 `settings.json` 后无效果

**解决方案**:

```bash
# 1. 验证配置文件
cat ~/.claude/settings.json | python -m json.tool

# 2. 重启 Claude
exit
claude

# 3. 检查配置路径
ls -la ~/.claude/settings.json
ls -la .claude/settings.json
```

### 2. CLAUDE.md 不生效

**症状**: CLAUDE.md 中的规则被忽略

**解决方案**:
- 确保 CLAUDE.md 在项目根目录
- 检查文件名大小写（必须是 `CLAUDE.md`）
- 确保文件格式正确
- 使用 `/rules` 查看加载的规则

### 3. Hooks 不执行

**症状**: 定义的 Hooks 没有触发

**解决方案**:

```bash
# 1. 检查 Hook 文件权限
chmod +x .claude/hooks/*.sh

# 2. 验证 Hook 配置
cat .claude/settings.json

# 3. 启用调试
DEBUG=hooks:* claude
```

## MCP 问题

### 1. MCP Server 不启动

**症状**: MCP 工具不可用

**解决方案**:

```bash
# 1. 检查 MCP 配置
cat ~/.claude/mcp.json

# 2. 手动启动 MCP Server
npx -y @anthropic-ai/mcp-server-filesystem

# 3. 重启 Claude
exit
claude
```

### 2. MCP 工具不可用

**症状**: 某些 MCP 工具调用失败

**解决方案**:
- 检查 Token 权限
- 验证服务器配置
- 查看 MCP Server 日志

### 3. MCP 连接超时

**症状**: `MCP connection timeout`

**解决方案**:

```json
{
  "mcpServers": {
    "server-name": {
      "timeout": 60
    }
  }
}
```

## 输出问题

### 1. 输出被截断

**症状**: 响应或文件内容被截断

**解决方案**:
- 使用 `/compact` 压缩上下文
- 减少请求的文件数量
- 分批读取大文件

### 2. 格式错误

**症状**: 输出格式混乱

**解决方案**:
```bash
# 清除并重新生成
/clear
# 重新描述需求
```

### 3. 中文显示问题

**症状**: 中文显示乱码

**解决方案**:
```bash
# 设置终端编码
export LANG=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8

# 或在终端设置
# Terminal > Preferences > Encoding > Unicode (UTF-8)
```

## 调试模式

### 启用调试

```bash
# 启用所有调试
DEBUG=* claude

# 启用特定调试
DEBUG=hooks:* claude
DEBUG=mcp:* claude
DEBUG=tools:* claude
```

### 查看日志

```bash
# 查看 Claude 日志
cat ~/.claude/logs/claude.log

# 查看最近的日志
tail -f ~/.claude/logs/claude.log

# 清理日志
rm ~/.claude/logs/*.log
```

### 重置所有设置

```bash
# 备份当前配置
cp -r ~/.claude ~/.claude-backup

# 重置为默认配置
rm -rf ~/.claude
claude --init
```

## 获取帮助

### 查看帮助

```bash
claude --help
```

### 提交问题

如果你遇到了无法解决的问题：

1. 查看 [GitHub Issues](https://github.com/anthropics/claude-code/issues)
2. 创建新的 Issue 并提供：
   - Claude Code 版本
   - 操作系统
   - 错误日志
   - 复现步骤

### 社区支持

- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Anthropic Discord](https://discord.gg/anthropic)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/claude-code)

::: tip 遇到问题
大多数问题都可以通过检查配置、网络连接或重启 Claude Code 解决。如果问题持续存在，建议查看官方文档或社区资源。
:::
