# Sticky Tech-Demos Monorepo

Weekday cloud agents build small tech demos here — one self-contained app per approved
tech pick, under `apps/<slug>/`.

## How it works

- **Scout runs** append candidate tech picks to `tracking/seen-bookmarks.json` (`proposed`).
- An approved pick becomes a demo app: the agent follows `skills/project-planning/SKILL.md`
  to write `apps/<slug>/PLAN.md`, then builds a single-user MVP in `apps/<slug>/`.
- Each app is self-contained: `cd apps/<slug> && bun install && bun run dev`.
- **Bun** is the package manager and script runner throughout.
- Every demo PR must attach at least one **screenshot** and one **video** of the running
  app to pass validation.

## Layout

```
AGENTS.md                     rules for demo agents
apps/                         one demo app per pick (apps/<kebab-slug>/)
skills/project-planning/      how to write a PLAN.md before building
tracking/seen-bookmarks.json  proposed + built tech picks
```

See `AGENTS.md` for the full rules.
