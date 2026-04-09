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
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '基础使用', link: '/guide/basic-usage' },
          { text: '核心概念', link: '/guide/concepts' },
        ]
      },
      {
        text: '高级特性',
        items: [
          { text: 'Agents', link: '/guide/agents' },
          { text: 'MCP', link: '/guide/mcp' },
          { text: 'Rules', link: '/guide/rules' },
          { text: 'Hooks', link: '/guide/hooks' },
          { text: 'Memory', link: '/guide/memory' },
        ]
      },
      {
        text: '参考',
        items: [
          { text: 'Slash 命令', link: '/guide/slash-commands' },
          { text: '配置文件', link: '/guide/settings' },
          { text: '工具列表', link: '/guide/tools' },
          { text: '故障排除', link: '/guide/troubleshooting' },
        ]
      },
      {
        text: '实战',
        items: [
          { text: '最佳实践', link: '/guide/best-practices' },
          { text: '项目模板', link: '/guide/templates' },
        ]
      },
    ],

    sidebar: {
      '/guide/': [
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
          text: '核心概念',
          items: [
            { text: 'Agents', link: '/guide/agents' },
            { text: 'MCP', link: '/guide/mcp' },
            { text: 'Rules', link: '/guide/rules' },
            { text: 'Memory', link: '/guide/memory' },
            { text: 'Hooks', link: '/guide/hooks' },
          ]
        },
        {
          text: '参考',
          items: [
            { text: 'Slash 命令', link: '/guide/slash-commands' },
            { text: '配置文件', link: '/guide/settings' },
            { text: '工具列表', link: '/guide/tools' },
            { text: '故障排除', link: '/guide/troubleshooting' },
          ]
        },
        {
          text: '实战',
          items: [
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
      text: '最后更新',
      formatOptions: {
        dateOptions: { year: 'numeric', month: 'long', day: 'numeric' }
      }
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
