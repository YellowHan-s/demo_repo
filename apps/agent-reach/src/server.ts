import { channels, doctorMock } from "./channels";

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC_DIR = new URL("../public/", import.meta.url).pathname;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

// Proxy for Jina Reader (https://r.jina.ai/<url>) to avoid browser CORS.
async function handleRead(target: string): Promise<Response> {
  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return json({ error: "无效的 URL，请包含 http(s):// 前缀" }, 400);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return json({ error: "仅支持 http/https URL" }, 400);
  }
  try {
    const res = await fetch(`https://r.jina.ai/${parsed.href}`, {
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(30_000),
    });
    const text = await res.text();
    if (!res.ok) {
      return json({ error: `Jina Reader 返回 ${res.status}`, detail: text.slice(0, 500) }, 502);
    }
    return json({ url: parsed.href, markdown: text });
  } catch (err) {
    return json({ error: `请求 Jina Reader 失败：${err instanceof Error ? err.message : String(err)}` }, 502);
  }
}

// Public GitHub API summary for owner/repo — no token, mirrors the
// "GitHub works without login for public repos" story.
async function handleGithub(repo: string): Promise<Response> {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return json({ error: "格式应为 owner/repo，例如 Panniantong/Agent-Reach" }, 400);
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "agent-reach-demo" },
      signal: AbortSignal.timeout(15_000),
    });
    if (res.status === 404) return json({ error: "仓库不存在或不是公开仓库" }, 404);
    if (res.status === 403) return json({ error: "GitHub API 限流，请稍后再试" }, 429);
    if (!res.ok) return json({ error: `GitHub API 返回 ${res.status}` }, 502);
    const data = (await res.json()) as Record<string, any>;
    return json({
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      language: data.language,
      license: data.license?.spdx_id ?? null,
      updatedAt: data.updated_at,
      htmlUrl: data.html_url,
      topics: data.topics ?? [],
    });
  } catch (err) {
    return json({ error: `请求 GitHub API 失败：${err instanceof Error ? err.message : String(err)}` }, 502);
  }
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/api/channels") return json(channels);
    if (path === "/api/doctor") return json(doctorMock);
    if (path === "/api/read") {
      const target = url.searchParams.get("url");
      if (!target) return json({ error: "缺少 url 参数" }, 400);
      return handleRead(target);
    }
    if (path === "/api/github") {
      const repo = url.searchParams.get("repo");
      if (!repo) return json({ error: "缺少 repo 参数" }, 400);
      return handleGithub(repo.trim());
    }

    const filePath = path === "/" ? "index.html" : path.slice(1);
    const file = Bun.file(PUBLIC_DIR + filePath);
    if (await file.exists()) return new Response(file);
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Agent Reach Channel Explorer → http://localhost:${server.port}`);
