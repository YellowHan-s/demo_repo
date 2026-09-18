# PLAN — Agent Reach Channel Explorer

## 1. Goal

Build a single-user web demo that visually explains **Agent Reach**
(https://github.com/Panniantong/Agent-Reach), an MIT-licensed *capability layer*
that selects, installs, health-checks, and routes upstream CLIs so AI agents can
read and search the internet. The demo teaches the core story — channel routing,
zero-config vs needs-login platforms, and the "agents call upstream tools
directly" philosophy — and includes a live zero-config playground (read any URL
via Jina Reader) that works without installing the Agent Reach system stack.

## 2. Non-goals

- No authentication, no persistence, no multi-tenancy, no deployment hardening.
- Do NOT run `agent-reach install --system` or install Node/gh/mcporter as the product.
- No Twitter/XiaoHongShu cookies or API keys of any kind.
- No mobile-specific support; no test coverage beyond a smoke check.
- The "doctor" panel is curated static data based on upstream docs, clearly
  labeled illustrative — we do not shell out to a real `agent-reach doctor`.

## 3. Stack

- **Runtime & package manager:** Bun (`bun install`, `bun run dev`).
- **Tech pick:** Agent Reach concepts (upstream repo `main` as of 2026-09);
  the live playground uses the real Jina Reader endpoint (`https://r.jina.ai/<url>`)
  and the public GitHub REST API — both zero-config paths Agent Reach routes to.
- **Server:** `Bun.serve` with static file serving + two tiny proxy endpoints
  (`/api/read`, `/api/github`) to avoid browser CORS. No framework needed.
- **Frontend:** vanilla HTML/CSS/JS served as static files. Zero npm dependencies.

## 4. File layout

```
apps/agent-reach/
  PLAN.md
  README.md
  package.json
  src/
    server.ts        # Bun.serve: static files + /api/read (Jina) + /api/github proxies
    channels.ts      # curated channel + doctor data (from upstream README)
  public/
    index.html       # landing, channel grid, playgrounds, doctor panel
    app.js           # rendering + playground fetch logic
    styles.css       # styling
```

## 5. Acceptance checks

- [ ] `bun install && bun run dev` works from a fresh clone of `apps/agent-reach/`.
- [ ] The core feature of the tech pick is visibly demonstrated: channel grid
      with zero-config/needs-login badges, upstream tool names, and example commands.
- [ ] At least one **screenshot** of the running app is attached to the PR.
- [ ] At least one **video** of the running app is attached to the PR.
- [ ] No files outside `apps/agent-reach/` were modified (except
      `tracking/seen-bookmarks.json`, which this task asks us to update).

Demo-specific checks:

- [ ] Pasting a public URL into the Jina Reader playground returns readable
      markdown/text through the `/api/read` proxy (no CORS errors).
- [ ] Entering a public `owner/repo` in the GitHub playground shows repo
      summary (description, stars, language) via the public GitHub API, no token.
- [ ] The doctor mock panel shows channel → active-backend routing (e.g.
      `bilibili: bili-cli ▸ OpenCLI ▸ search API`) and is labeled illustrative.
- [ ] Landing section explains Agent Reach in 2–3 sentences and links the
      upstream repo.
