# Claude Code 完全指南

## 项目概述

这是一个使用 VitePress 构建的 Claude Code 完全指南文档网站。

## 技术栈

- VitePress 1.6.x
- Node.js 20+
- Markdown

## 项目结构

```
claude-code-guide/
├── docs/                    # 文档源文件
│   ├── .vitepress/          # VitePress 配置
│   │   ├── config.mts      # 配置文件
│   │   └── theme/           # 主题定制
│   ├── guide/               # 指南文档
│   │   ├── getting-started.md
│   │   ├── basic-usage.md
│   │   ├── concepts.md
│   │   ├── agents.md
│   │   ├── mcp.md
│   │   ├── rules.md
│   │   ├── memory.md
│   │   ├── hooks.md
│   │   ├── slash-commands.md
│   │   ├── settings.md
│   │   ├── tools.md
│   │   ├── troubleshooting.md
│   │   ├── best-practices.md
│   │   ├── templates.md
│   │   └── configuration.md
│   └── index.md             # 首页
├── .github/
│   └── workflows/           # CI/CD
└── package.json
```

## 常用命令

- `npm run docs:dev` - 启动开发服务器
- `npm run docs:build` - 构建生产版本
- `npm run docs:preview` - 预览构建结果

## 部署

推送到 main 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

## 添加新文档

1. 在 `docs/guide/` 目录下创建新的 `.md` 文件
2. 在 `docs/.vitepress/config.mts` 中添加导航和侧边栏配置
3. 在本地测试后提交

---

[default]

role: VitePress 文档专家，熟练使用 Markdown 和 Vue 3
expertise:
  - VitePress 配置
  - Markdown 写作
  - 文档结构设计

workingStyle:
  - 保持文档清晰简洁
  - 使用中文撰写
  - 添加代码示例

rules:
  - 每个文档文件必须有标题
  - 使用代码块时标注语言
  - 表格用于对比信息
  - tip/info/warning 用于重要提示
