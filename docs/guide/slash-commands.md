# Slash Commands

Slash Commands 是 Claude Code 中的快捷命令，以 `/` 开头，用于触发特定功能或操作。

## 内置 Slash Commands

### 1. `/help` - 帮助

显示帮助信息：

```
/help
```

### 2. `/exit` - 退出

退出 Claude Code：

```
/exit
```

或：

```
/bye
```

### 3. `/new` - 新会话

开始新会话：

```
/new
```

### 4. `/clear` - 清屏

清除当前屏幕：

```
/clear
```

### 5. `/compact` - 压缩上下文

手动压缩上下文窗口：

```
/compact
```

### 6. `/abort` - 取消操作

取消当前正在执行的操作：

```
/abort
```

### 7. `/rules` - 查看规则

显示当前项目的规则配置：

```
/rules
```

### 8. `/memory` - 查看记忆

查看 Claude 的记忆内容：

```
/memory
/memory list
/memory add [内容]
/memory remove [内容]
```

### 9. `/review` - 代码审查

对代码进行审查：

```
/review [文件或目录]
```

### 10. `/test` - 生成测试

为指定代码生成测试：

```
/test [文件或函数]
```

## 自定义 Slash Commands

### 在 CLAUDE.md 中定义

```markdown
[scommands]

## 常用命令别名
/test: "运行测试"
  → npx vitest run

/build: "构建项目"
  → npm run build

/deploy: "部署项目"
  → npm run deploy

/ci: "运行 CI 检查"
  → npm run lint && npm run type-check && npm run test

## 自定义复合命令
/doc: |
  生成文档
  1. 更新 API 文档
  2. 更新 README
  3. 提交更改

/deploy-staging: |
  部署到预发布环境
  1. 构建项目
  2. 运行集成测试
  3. 部署到 staging
  4. 发送通知
```

### 创建脚本命令

```bash
#!/bin/bash
# .claude/commands/build.sh

echo "🔨 开始构建项目..."

# 清理
npm run clean

# 安装依赖
npm install

# 类型检查
npm run type-check

# 构建
npm run build

echo "✅ 构建完成！"
```

使用：

```
/build
```

## 命令格式

### 基本格式

```
/command
```

### 带参数

```
/command arg1 arg2
```

### 带选项

```
/command --option value
```

### 示例

```
/test src/utils/string.ts
/git commit -m "feat: 添加新功能"
/deploy --env production
```

## 常用命令场景

### 1. Git 操作

```
/git status
/git commit -m "feat: 添加登录功能"
/git push
/git branch feature/new-feature
/git checkout main
/git merge feature/new-feature
/git log --oneline -10
/git diff HEAD~1
```

### 2. 包管理

```
/npm install
/npm install react react-dom
/npm run dev
/npm run build
/npm test
/npm run lint
```

### 3. Docker

```
/docker build
/docker run -p 3000:3000 myapp
/docker-compose up
/docker-compose down
/docker logs myapp
```

### 4. 数据库

```
/db migrate
/db seed
/db reset
/db backup
/db restore backup.sql
```

### 5. 部署

```
/deploy
/deploy:staging
/deploy:production
/deploy:rollback
```

## 命令组合

### 管道

```
/git status | grep modified
```

### 条件执行

```
/if [ -f package.json ]; then npm install; fi
```

### 并行执行

```
/parallel "npm test" "npm run lint"
```

## 自定义命令工作流

### 创建完整工作流命令

```bash
#!/bin/bash
# .claude/commands/pr.sh

BRANCH_NAME=$1
PR_TITLE=$2

if [ -z "$BRANCH_NAME" ] || [ -z "$PR_TITLE" ]; then
  echo "用法: /pr <分支名> <PR标题>"
  exit 1
fi

echo "📋 创建 Pull Request..."

# 创建分支
git checkout -b $BRANCH_NAME

# 提交更改
git add .
git commit -m "$PR_TITLE"

# 推送到远程
git push -u origin $BRANCH_NAME

# 创建 PR
gh pr create --title "$PR_TITLE" --body "自动创建的 PR"

echo "✅ PR 创建完成！"
```

使用：

```
/pr feature/add-login "feat: 添加用户登录功能"
```

### 自动测试命令

```bash
#!/bin/bash
# .claude/commands/ci-check.sh

echo "🔍 运行 CI 检查..."

# Lint
echo "运行 ESLint..."
npm run lint
if [ $? -ne 0 ]; then echo "❌ Lint 失败"; exit 1; fi

# Type check
echo "运行类型检查..."
npm run type-check
if [ $? -ne 0 ]; then echo "❌ 类型检查失败"; exit 1; fi

# Test
echo "运行测试..."
npm test
if [ $? -ne 0 ]; then echo "❌ 测试失败"; exit 1; fi

# Build
echo "运行构建..."
npm run build
if [ $? -ne 0 ]; then echo "❌ 构建失败"; exit 1; fi

echo "✅ 所有检查通过！"
```

## 命令别名

### 在配置中设置

```json
{
  "aliases": {
    "ci": "npm run lint && npm run type-check && npm test",
    "dev": "npm run dev",
    "build": "npm run build",
    "test": "npm test",
    "deploy": "npm run deploy"
  }
}
```

### 使用别名

```
/ci
/dev
/build
/test
```

## 命令历史

### 查看历史

```
/history
```

### 重复执行

```
!npm test
!git push
```

### 保存常用命令

```
/save "npm test" as run-tests
```

## 命令执行环境

### 环境变量

```
/env FOO=bar npm run script
```

### 工作目录

```
/cd src/components && /test
```

### 超时设置

```
/timeout 60 npm run long-task
```

## 命令日志

Claude Code 会记录所有执行的命令：

```
[2024-01-15 10:30:45] /git commit -m "feat: 添加功能"
[2024-01-15 10:31:12] /npm run build
[2024-01-15 10:31:45] /npm test
```

查看日志：

```
/logs
/logs --filter "git"
```

## 故障排除

### 命令不识别

```
Unknown command: /mycommand
```

解决方案：检查命令是否已定义。

### 命令执行失败

```
Command failed: npm run build
Error: ENOENT: no such file
```

解决方案：检查命令语法和路径。

### 权限问题

```
Permission denied: ./script.sh
```

解决方案：

```bash
chmod +x .claude/commands/*.sh
```

## 最佳实践

### 1. 命令命名

```
✅ 清晰描述性名称
   /deploy-production
   /run-ci-checks

❌ 模糊缩写
   /dp
   /ci
```

### 2. 参数验证

```bash
if [ -z "$1" ]; then
  echo "错误: 缺少必需参数"
  echo "用法: $0 <参数>"
  exit 1
fi
```

### 3. 错误处理

```bash
set -e  # 遇到错误立即退出
set -u  # 使用未定义变量时报错
```

### 4. 文档化

```bash
#!/bin/bash
# ================================
# 命令名称: deploy
# 描述: 部署应用到生产环境
# 用法: /deploy [--rollback]
# ================================
```

## 命令模板库

### 常用命令集合

```markdown
# .claude/commands/README.md

## 可用命令

| 命令 | 描述 | 用法 |
|------|------|------|
| /ci | 运行完整 CI 检查 | /ci |
| /test | 运行测试 | /test [文件] |
| /build | 构建项目 | /build |
| /deploy | 部署到生产 | /deploy |
| /pr | 创建 PR | /pr <分支> <标题> |
| /backup | 备份数据库 | /backup |
```

::: tip 效率提升
善用 Slash Commands 可以大大提升工作效率。建议为常用操作创建自定义命令。
:::
