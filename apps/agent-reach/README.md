# Agent Reach · Channel Explorer

单用户 MVP 演示，可视化讲解 [Agent Reach](https://github.com/Panniantong/Agent-Reach)
—— 一个为 AI Agent 选型、安装、体检、路由上游 CLI 的开源**能力层**。

## 运行

```bash
cd apps/agent-reach
bun install
bun run dev
# → http://localhost:3000
```

## 内容

- **平台网格**：Web/GitHub/YouTube/RSS/Exa/B站/Twitter/小红书等渠道，
  标注零配置 vs 需登录、主力上游工具、路由链和示例命令。
- **在线试玩 1**：通过 Jina Reader（`https://r.jina.ai/<url>`）读取任意网页，
  由 Bun 服务器代理避免 CORS，展示可读的 Markdown 预览。
- **在线试玩 2**：输入公开 `owner/repo`，用公开 GitHub API（无 Token）展示仓库摘要。
- **doctor 面板**：`agent-reach doctor` 输出的静态示意——渠道 → 当前后端映射，
  数据整理自上游 README，已标注为示意。

计划见 [PLAN.md](./PLAN.md)。
