# 快速开始

欢迎来到 Claude Code 完全指南！本节将帮助你快速上手 Claude Code。

## 什么是 Claude Code？

Claude Code 是 Anthropic 官方推出的 CLI 工具，让你可以直接在终端中使用 Claude 进行编程辅助。它不仅仅是简单的代码补全，而是一个能够理解整个项目、进行复杂操作的 AI 助手。

**核心能力：**
- 读写文件、创建项目
- 执行终端命令
- 使用 Git 进行版本控制
- 搜索和理解代码库
- 调用外部工具（MCP）
- 记住项目上下文

## 安装 Claude Code

### macOS

使用 Homebrew 安装：

```bash
brew install claude-cli
```

或者下载安装：

```bash
# 下载最新版本
curl -fsSL https://downloads.anthropic.com/claude-code/latest/darwin-arm64 -o claude-code
chmod +x claude-code
sudo mv claude-code /usr/local/bin/
```

### Linux

```bash
# x86_64
curl -fsSL https://downloads.anthropic.com/claude-code/latest/linux-x86_64 -o claude-code
chmod +x claude-code
sudo mv claude-code /usr/local/bin/

# ARM64
curl -fsSL https://downloads.anthropic.com/claude-code/latest/linux-aarch64 -o claude-code
chmod +x claude-code
sudo mv claude-code /usr/local/bin/
```

### Windows

使用 Scoop 或手动下载：

```powershell
scoop install claude-code
```

## 首次设置

安装完成后，运行以下命令进行身份验证：

```bash
claude-code --init
# 或
claude --code
```

系统会提示你：
1. 登录 Anthropic 账号
2. 输入 API Key
3. 选择默认设置

### 获取 API Key

1. 访问 [ Anthropic Console ](https://console.anthropic.com/)
2. 进入 API Keys 页面
3. 点击 Create Key
4. 复制生成的 Key

::: warning 注意
保护好你的 API Key，不要泄露给他人或提交到 GitHub
:::

## 启动 Claude Code

在任意目录下启动 Claude Code：

```bash
claude
```

或者进入指定项目：

```bash
cd /path/to/your/project
claude
```

## 首次对话

启动后，你可以直接输入你的需求：

```
帮我创建一个 React 组件，显示用户列表
```

```
修复 src/utils.ts 中的类型错误
```

```
解释这段代码的作用：/src/auth/login.ts
```

Claude Code 会：
1. 理解你的需求
2. 分析项目文件
3. 制定执行计划
4. 执行操作（读取/修改文件、运行命令等）
5. 汇报结果

## 基本命令

| 命令 | 说明 |
|------|------|
| `claude` | 启动 Claude Code |
| `claude --help` | 显示帮助信息 |
| `claude --version` | 查看版本 |
| `claude --print <prompt>` | 单次执行命令 |
| `/exit` 或 `/bye` | 退出 Claude Code |

## 下一步

- [基础使用指南](/guide/basic-usage) - 了解日常使用技巧
- [核心概念](/guide/concepts) - 理解 Agents、Rules、MCP 等
- [配置指南](/guide/configuration) - 自定义你的工作环境

::: tip 提示
在开始之前，建议先阅读 [核心概念](/guide/concepts) 部分，这会帮助你更好地理解后续内容。
:::
