import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Claude Code 完全指南',
  description: '掌握 Claude Code 的完整教程，包括 rules、agents、MCP、hooks 等核心概念',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#5f6368' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Claude Code 完全指南' }],
    ['meta', { property: 'og:description', content: '掌握 Claude Code 的完整教程' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Claude Code 完全指南',

    nav: [
      { text: '首页', link: '/' },
      {
        text: '入门',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '基础使用', link: '/guide/basic-usage' },
          { text: '核心概念', link: '/guide/concepts' },
          { text: '配置指南', link: '/guide/configuration' },
        ]
      },
      {
        text: '进阶',
        items: [
          { text: 'Agents 代理系统', link: '/guide/agents' },
          { text: 'MCP 协议集成', link: '/guide/mcp' },
          { text: 'Rules 规则引擎', link: '/guide/rules' },
          { text: 'Memory 持久化记忆', link: '/guide/memory' },
          { text: 'Hooks 钩子系统', link: '/guide/hooks' },
          { text: 'Slash 命令', link: '/guide/slash-commands' },
          { text: 'Settings 配置', link: '/guide/settings' },
          { text: '工具详解', link: '/guide/tools' },
        ]
      },
      {
        text: '高级',
        items: [
          { text: '性能优化与成本控制', link: '/guide/advanced/performance' },
          { text: '自定义工作流', link: '/guide/advanced/custom-workflows' },
          { text: '多 Agent 编排', link: '/guide/advanced/orchestration' },
          { text: 'CI/CD 集成', link: '/guide/advanced/ci-cd' },
          { text: '安全审计', link: '/guide/advanced/security' },
        ]
      },
      {
        text: '生态工具',
        items: [
          { text: 'Everything Claude Code', link: '/guide/ecosystem/everything-claude-code' },
          { text: 'AgentShield 安全扫描', link: '/guide/ecosystem/agentshield' },
          { text: 'Skill Creator', link: '/guide/ecosystem/skill-creator' },
          { text: 'Cross-Harness 支持', link: '/guide/ecosystem/cross-harness' },
        ]
      },
      {
        text: '实战案例',
        items: [
          { text: '全栈应用开发', link: '/guide/examples/fullstack' },
          { text: '微服务架构', link: '/guide/examples/microservices' },
          { text: '开源贡献', link: '/guide/examples/open-source' },
        ]
      },
      {
        text: '参考',
        items: [
          { text: '故障排除', link: '/guide/troubleshooting' },
          { text: '最佳实践', link: '/guide/best-practices' },
          { text: '项目模板', link: '/guide/templates' },
        ]
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门篇',
          collapsed: false,
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '基础使用', link: '/guide/basic-usage' },
            { text: '核心概念', link: '/guide/concepts' },
            { text: '配置指南', link: '/guide/configuration' },
          ]
        },
        {
          text: '进阶篇',
          collapsed: false,
          items: [
            { text: 'Agents 代理系统', link: '/guide/agents' },
            { text: 'MCP 协议集成', link: '/guide/mcp' },
            { text: 'Rules 规则引擎', link: '/guide/rules' },
            { text: 'Memory 持久化记忆', link: '/guide/memory' },
            { text: 'Hooks 钩子系统', link: '/guide/hooks' },
            { text: 'Slash 命令', link: '/guide/slash-commands' },
            { text: 'Settings 配置', link: '/guide/settings' },
            { text: '工具详解', link: '/guide/tools' },
          ]
        },
        {
          text: '高级篇',
          collapsed: false,
          items: [
            { text: '性能优化与成本控制', link: '/guide/advanced/performance' },
            { text: '自定义工作流', link: '/guide/advanced/custom-workflows' },
            { text: '多 Agent 编排', link: '/guide/advanced/orchestration' },
            { text: 'CI/CD 集成', link: '/guide/advanced/ci-cd' },
            { text: '安全审计', link: '/guide/advanced/security' },
          ]
        },
        {
          text: '生态工具',
          collapsed: false,
          items: [
            { text: 'Everything Claude Code', link: '/guide/ecosystem/everything-claude-code' },
            { text: 'AgentShield 安全扫描', link: '/guide/ecosystem/agentshield' },
            { text: 'Skill Creator', link: '/guide/ecosystem/skill-creator' },
            { text: 'Cross-Harness 支持', link: '/guide/ecosystem/cross-harness' },
          ]
        },
        {
          text: '实战案例',
          collapsed: false,
          items: [
            { text: '全栈应用开发', link: '/guide/examples/fullstack' },
            { text: '微服务架构', link: '/guide/examples/microservices' },
            { text: '开源贡献', link: '/guide/examples/open-source' },
          ]
        },
        {
          text: '参考',
          collapsed: false,
          items: [
            { text: '故障排除', link: '/guide/troubleshooting' },
            { text: '最佳实践', link: '/guide/best-practices' },
            { text: '项目模板', link: '/guide/templates' },
          ]
        },
      ],
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },

    editLink: {
      pattern: 'https://github.com/DomWZhang/claude-code-guide/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    lastUpdated: {
      text: '最后更新'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/DomWZhang/claude-code-guide' }
    ],

    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2024-present Claude Code Guide'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    container: {
      tipLabel: '💡 提示',
      warningLabel: '⚠️ 注意',
      dangerLabel: '🚨 危险',
      infoLabel: 'ℹ️ 信息',
      detailsLabel: '详情'
    }
  },

  sitemap: {
    hostname: 'https://DomWZhang.github.io/claude-code-guide'
  }
})
