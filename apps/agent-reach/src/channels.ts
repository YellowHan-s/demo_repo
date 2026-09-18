// Curated channel + doctor data based on the upstream Agent Reach README
// (https://github.com/Panniantong/Agent-Reach). Illustrative snapshot, not live probing.

export interface Channel {
  id: string;
  icon: string;
  name: string;
  zeroConfig: boolean;
  primaryTool: string;
  backends: string[]; // ordered: preferred first, fallbacks after
  outOfBox: string;
  unlockable?: string;
  example: string;
}

export const channels: Channel[] = [
  {
    id: "web",
    icon: "🌐",
    name: "网页 Web",
    zeroConfig: true,
    primaryTool: "Jina Reader",
    backends: ["Jina Reader"],
    outOfBox: "阅读任意网页，返回干净的 Markdown",
    example: "curl https://r.jina.ai/https://example.com",
  },
  {
    id: "github",
    icon: "📦",
    name: "GitHub",
    zeroConfig: true,
    primaryTool: "gh CLI",
    backends: ["gh CLI"],
    outOfBox: "读公开仓库 + 搜索（无需登录）",
    unlockable: "私有仓库、提 Issue/PR、Fork（登录后）",
    example: "gh repo view Panniantong/Agent-Reach",
  },
  {
    id: "youtube",
    icon: "📺",
    name: "YouTube",
    zeroConfig: true,
    primaryTool: "yt-dlp",
    backends: ["yt-dlp"],
    outOfBox: "字幕提取 + 视频搜索",
    example: "yt-dlp --write-auto-sub --skip-download <video-url>",
  },
  {
    id: "rss",
    icon: "📡",
    name: "RSS / Atom",
    zeroConfig: true,
    primaryTool: "feedparser",
    backends: ["feedparser"],
    outOfBox: "阅读任意 RSS/Atom 源",
    example: 'python -c "import feedparser; print(feedparser.parse(URL))"',
  },
  {
    id: "exa",
    icon: "🔍",
    name: "全网搜索 Exa",
    zeroConfig: true,
    primaryTool: "Exa via mcporter",
    backends: ["Exa (MCP)"],
    outOfBox: "全网语义搜索（MCP 接入，免费无需 Key，自动配置）",
    example: 'mcporter call exa search --query "LLM framework comparison"',
  },
  {
    id: "bilibili",
    icon: "📺",
    name: "B站 Bilibili",
    zeroConfig: true,
    primaryTool: "bili-cli",
    backends: ["bili-cli", "OpenCLI", "搜索 API"],
    outOfBox: "搜索 + 视频详情（无需登录）",
    unlockable: "字幕（OpenCLI）",
    example: 'bili search "AI 教程"',
  },
  {
    id: "v2ex",
    icon: "💻",
    name: "V2EX",
    zeroConfig: true,
    primaryTool: "V2EX API",
    backends: ["V2EX API"],
    outOfBox: "热门帖子、节点帖子、帖子详情+回复、用户信息",
    example: "agent-reach v2ex hot",
  },
  {
    id: "twitter",
    icon: "🐦",
    name: "Twitter / X",
    zeroConfig: false,
    primaryTool: "twitter-cli",
    backends: ["twitter-cli", "OpenCLI", "bird"],
    outOfBox: "读单条推文",
    unlockable: "搜索推文、浏览时间线、读长文（需 Cookie 登录态）",
    example: 'twitter search "agent reach" --limit 10',
  },
  {
    id: "reddit",
    icon: "📖",
    name: "Reddit",
    zeroConfig: false,
    primaryTool: "OpenCLI",
    backends: ["OpenCLI", "rdt-cli"],
    outOfBox: "无零配置路径：匿名接口已被封",
    unlockable: "搜索 + 读帖子和评论（浏览器登录态 / Cookie）",
    example: 'opencli reddit search "same bug"',
  },
  {
    id: "xiaohongshu",
    icon: "📕",
    name: "小红书",
    zeroConfig: false,
    primaryTool: "OpenCLI",
    backends: ["OpenCLI", "xiaohongshu-mcp", "xhs-cli"],
    outOfBox: "—",
    unlockable: "搜索、阅读、评论（复用已有 Chrome 会话）",
    example: 'opencli xhs search "产品口碑"',
  },
  {
    id: "linkedin",
    icon: "💼",
    name: "LinkedIn",
    zeroConfig: true,
    primaryTool: "mcp-server-linkedin",
    backends: ["mcp-server-linkedin", "Jina Reader"],
    outOfBox: "Jina Reader 读公开页面",
    unlockable: "Profile 详情、公司页面、职位搜索",
    example: "curl https://r.jina.ai/https://www.linkedin.com/company/anthropic",
  },
  {
    id: "facebook",
    icon: "📘",
    name: "Facebook",
    zeroConfig: false,
    primaryTool: "OpenCLI",
    backends: ["OpenCLI"],
    outOfBox: "—",
    unlockable: "搜索、主页、Feed、群组列表（桌面浏览器登录态）",
    example: "opencli facebook feed",
  },
  {
    id: "instagram",
    icon: "📷",
    name: "Instagram",
    zeroConfig: false,
    primaryTool: "OpenCLI",
    backends: ["OpenCLI", "官方 Graph API"],
    outOfBox: "—",
    unlockable: "用户搜索、Profile、最近帖子、Explore（浏览器登录态）",
    example: "opencli instagram profile natgeo",
  },
];

// Illustrative snapshot of what `agent-reach doctor` reports: for each channel,
// which backend in the ordered list is currently active after real probing.
export interface DoctorEntry {
  channel: string;
  backends: { name: string; status: "active" | "skipped" | "unavailable" | "retired" }[];
  note?: string;
}

export const doctorMock: DoctorEntry[] = [
  { channel: "web", backends: [{ name: "Jina Reader", status: "active" }] },
  { channel: "github", backends: [{ name: "gh CLI", status: "active" }], note: "未登录：仅公开仓库" },
  { channel: "youtube", backends: [{ name: "yt-dlp", status: "active" }] },
  { channel: "rss", backends: [{ name: "feedparser", status: "active" }] },
  { channel: "exa_search", backends: [{ name: "Exa via mcporter", status: "active" }] },
  {
    channel: "bilibili",
    backends: [
      { name: "bili-cli", status: "active" },
      { name: "OpenCLI", status: "skipped" },
      { name: "搜索 API", status: "skipped" },
    ],
    note: "yt-dlp 已被 B站风控封死（412），2026-06 退役",
  },
  {
    channel: "twitter",
    backends: [
      { name: "twitter-cli", status: "unavailable" },
      { name: "OpenCLI", status: "unavailable" },
      { name: "bird", status: "unavailable" },
    ],
    note: "需要 Cookie：告诉 Agent「帮我配 Twitter」",
  },
  {
    channel: "reddit",
    backends: [
      { name: "OpenCLI", status: "unavailable" },
      { name: "rdt-cli", status: "unavailable" },
    ],
    note: "无零配置路径，需要登录态",
  },
  {
    channel: "xiaohongshu",
    backends: [
      { name: "OpenCLI", status: "unavailable" },
      { name: "xiaohongshu-mcp", status: "unavailable" },
      { name: "xhs-cli", status: "unavailable" },
    ],
    note: "需要已有 Chrome 会话或 Cookie-Editor 导出",
  },
  {
    channel: "linkedin",
    backends: [
      { name: "mcp-server-linkedin", status: "unavailable" },
      { name: "Jina Reader", status: "active" },
    ],
    note: "回退到 Jina Reader 读公开页面",
  },
];
