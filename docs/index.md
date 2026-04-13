---
layout: home

hero:
  name: "Claude Code 完全指南"
  text: "专业级 AI 编程助手教程"
  tagline: "从首次运行到高级编排，掌握 AI 辅助编程的完整技能树"
  image:
    src: /logo.png
    alt: Claude Code
  actions:
    - theme: brand
      text: 开始学习 →
      link: /guide/getting-started
    - theme: alt
      text: 核心概念
      link: /guide/concepts

features:
  - icon: 🟢
    title: 入门篇
    details: 安装配置、首次对话、基础交互模式、文件操作、Git 集成 — 5 分钟上手
  - icon: 🟡
    title: 进阶篇
    details: Rules 规则系统、Hooks 钩子自动化、Memory 跨会话记忆、Slash Commands 效率命令
  - icon: 🟠
    title: 专家篇
    details: Agents 代理系统、MCP 协议集成、多 Agent 编排、自定义工作流
  - icon: 🔴
    title: 生态工具
    details: Everything Claude Code、AgentShield、Skill Creator — 扩展原生能力
---

## 学习路径图

选择一个入口，按阶段深入：

### 阶段一：入门（Day 1）

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ① 安装配置          ② 首次对话         ③ 基础操作     │
│   ┌────────────┐      ┌────────────┐      ┌────────────┐│
│   │brew install│      │claude      │      │ 文件编辑   ││
│   │claude --    │ ──▶ │/new        │ ──▶  │ Git 操作   ││
│   │ version     │      │/help       │      │ 搜索阅读   ││
│   └────────────┘      └────────────┘      └────────────┘│
│                                                         │
│   目标：能独立完成日常编码任务                              │
│   所需时间：30 分钟                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**快速链接**：[安装指南](/guide/getting-started) → [基础使用](/guide/basic-usage) → [核心概念](/guide/concepts)

---

### 阶段二：进阶（Week 1）

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│   ④ Rules 规则引擎      ⑤ Hooks 钩子       ⑥ Memory 记忆    │
│   ┌────────────────┐    ┌────────────────┐  ┌────────────────┐│
│   │ CLAUDE.md      │    │ 自动化工作流    │  │ 跨会话上下文   ││
│   │ 编码规范       │ ──▶│ 安全门卫       │ ──▶│ 项目记忆持久化 ││
│   │ 行为指令       │    │ 输入输出拦截   │  │ 自动上下文加载 ││
│   └────────────────┘    └────────────────┘  └────────────────┘│
│                                                               │
│   目标：让 Claude 符合团队编码标准                            │
│   核心技能：编写高质量 CLAUDE.md                              │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**快速链接**：[Rules 规则系统](/guide/rules) → [Hooks 钩子](/guide/hooks) → [Memory 持久化](/guide/memory)

---

### 阶段三：专家（Week 2+）

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ⑦ Agents 代理系统       ⑧ MCP 协议集成      ⑨ 自定义工作流   │
│   ┌──────────────────┐   ┌──────────────────┐ ┌────────────────┐│
│   │ 任务委托         │   │ 连接外部工具      │ │ 多 Agent 编排  ││
│   │ 子 Agent 协作    │ ─▶│ GitHub / 数据库  │─▶│ 自动化流水线   ││
│   │ 专业化 Agent     │   │ Slack / 浏览器   │ │ 性能调优       ││
│   └──────────────────┘   └──────────────────┘ └────────────────┘│
│                                                                 │
│   目标：构建自动化、高质量的 AI 辅助开发工作流                    │
│   关键能力：架构设计、工具集成、系统化思维                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**快速链接**：[Agents 代理系统](/guide/agents) → [MCP 协议](/guide/mcp) → [自定义工作流](/guide/advanced/custom-workflows)

---

### 阶段四：生态扩展（按需）

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   🌟 Everything Claude Code   🛡️ AgentShield    🔧 Skill Creator│
│   ┌───────────────────────┐  ┌─────────────────┐ ┌────────────┐│
│   │ 38 个专业 Agents      │  │ 102 条安全规则  │ │ Git 历史   ││
│   │ 156 个可复用 Skills   │  │ 1282 项测试     │ │ 自动生成   ││
│   │ 跨平台支持            │  │ 三方对抗审查     │ │ SKILL.md   ││
│   │ 持续学习系统          │  │ 供应链审计      │ │            ││
│   └───────────────────────┘  └─────────────────┘ └────────────┘│
│                                                                │
│   推荐：安装 Everything Claude Code + AgentShield              │
│   预期：开发效率提升 30-50%                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**快速链接**：[Everything Claude Code](/guide/ecosystem/everything-claude-code) → [AgentShield](/guide/ecosystem/agentshield) → [Skill Creator](/guide/ecosystem/skill-creator)

---

## 为什么这本指南比官方文档更有价值？

Claude Code 官方文档提供了基础参考，但**实际高效使用**需要这本指南中的内容：

| 你需要知道 | 官方文档 | 本指南 |
|-----------|---------|--------|
| 如何配置 Rules 让代码风格一致 | ❌ 提及甚少 | ✅ 完整指南 + 模板 |
| 如何用 Hooks 实现自动化工作流 | ❌ 无 | ✅ 8 种 Hook + 实战配置 |
| 如何让 Claude 记住项目上下文 | ❌ 提及甚少 | ✅ Memory 系统详解 |
| /plan 和 /simplify 的正确用法 | ❌ 无 | ✅ 工作流集成 |
| 如何用 MCP 连接真实工具链 | ⚠️ 概念介绍 | ✅ 14 个 MCP Server 实战 |
| 如何构建多 Agent 协作系统 | ❌ 无 | ✅ 架构设计指南 |
| 如何优化 Token 成本 | ❌ 无 | ✅ 模型选择 + 压缩策略 |
| Everything Claude Code 怎么用 | ❌ 无 | ✅ 完整生态指南 |

## 常见用户画像

| 画像 | 当前状态 | 学习路径 | 预期收益 |
|------|---------|---------|---------|
| **编程新手** | 刚接触 CLI | 阶段一 → 二 | 快速上手，不被工具限制思维 |
| **日常开发者** | 用 Claude 完成简单任务 | 阶段二 → 三 | 让 Claude 真正成为搭档而非工具 |
| **技术负责人** | 需要团队标准化 | 阶段二 → 四 + CI/CD | 统一代码规范，降低 review 成本 |
| **效率极客** | 追求最大化产出 | 阶段一 → 四 + ECC | 全流程 AI 辅助，极限效率 |

## 效率提升路线

```
日常使用（无需额外配置）
  └─ 基础命令 → 节省 20% 时间

进阶配置（CLAUDE.md + Hooks）
  └─ 规则引擎 → 节省 40% 时间

专家模式（Agents + MCP）
  └─ 自动化编排 → 节省 60% 时间

生态工具（Everything Claude Code）
  └─ 专业 Agent + 持续学习 → 节省 70%+ 时间
```

## 快速导航

### 核心文档
- [快速开始](/guide/getting-started) — 安装、配置、首次对话
- [基础使用](/guide/basic-usage) — 交互模式、文件操作、Git 集成
- [核心概念](/guide/concepts) — 上下文、Token、工具调用原理

### 进阶文档
- [Rules 规则系统](/guide/rules) — CLAUDE.md 编写规范、实战模板
- [Hooks 钩子系统](/guide/hooks) — 8 种 Hook 详解、权限自动化
- [Memory 持久化](/guide/memory) — 跨会话上下文、项目记忆

### 高级文档
- [Agents 代理系统](/guide/agents) — 任务委托、多 Agent 协作
- [MCP 协议集成](/guide/mcp) — 连接 GitHub、数据库、Playwright
- [自定义工作流](/guide/advanced/custom-workflows) — 编排与自动化

### 生态工具
- [Everything Claude Code](/guide/ecosystem/everything-claude-code) — 全能扩展包
- [AgentShield](/guide/ecosystem/agentshield) — 安全审计

### 高级专题
- [性能优化与成本控制](/guide/advanced/performance) — Token 优化、模型选择
- [CI/CD 集成](/guide/advanced/ci-cd) — GitHub Actions 集成
- [安全审计](/guide/advanced/security) — 供应链安全

## 资源链接

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [Everything Claude Code GitHub](https://github.com/affaan-m/everything-claude-code)
- [AgentShield](https://github.com/affaan-m/agentshield)
- [MCP 官方仓库](https://github.com/modelcontextprotocol)

---

**准备好开始了吗？** [快速开始 →](/guide/getting-started)
