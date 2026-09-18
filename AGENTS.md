# AGENTS.md — Rules for Tech-Demo Agents

This repository is the **sticky tech-demos monorepo**. Weekday cloud agents build small,
self-contained demo apps here. Follow these rules exactly.

## Scope of changes

- Only add or update files under `apps/<kebab-slug>/` for your demo.
- The only file outside your app you may touch is `tracking/seen-bookmarks.json`,
  and only when the task asks you to (e.g. scout runs appending proposed candidates,
  or marking a pick as built).
- **Never create a new GitHub repository.** All work lands in this repo via branches and PRs.

## App requirements

- One app per approved tech pick, in `apps/<kebab-slug>/` (kebab-case slug, e.g. `apps/hono-htmx-todo/`).
- Each app must be **self-contained**: a fresh clone must work with just
  `cd apps/<slug> && bun install && bun run dev`.
- Prefer **Bun** for package management and scripts (`bun install`, `bun run`, `bunx`).
- Keep demos scoped to a single-user MVP — no auth, no multi-tenancy, no production hardening.
- Do not add secrets, tokens, or credentials anywhere in the repo.

## Planning before building

Before writing any demo code, read `skills/project-planning/SKILL.md` and follow it to
produce `apps/<slug>/PLAN.md`. The plan must exist in the PR alongside the code.

## Pull requests

- One branch and one PR per demo.
- Every demo PR must attach **both**:
  1. at least one **screenshot** of the running app, and
  2. at least one **video** (screen recording) of the running app.
  A PR missing either does not pass validation.
- The PR description should link the plan (`apps/<slug>/PLAN.md`) and state how to run the app.

## Tracking

- `tracking/seen-bookmarks.json` holds two arrays:
  - `proposed`: candidates appended by scout runs.
  - `built`: picks that have shipped as apps under `apps/`.
- Append, don't rewrite: preserve existing entries when updating this file.

## Deployment (if used later)

- Cloudflare Pages previews use **one Pages project** for the whole monorepo, with a path
  per app (`/apps/<slug>/`) — **not** one Pages project per app.
