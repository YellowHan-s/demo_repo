# Skill: Project Planning for Tech Demos

Turn an approved tech pick into a scoped `PLAN.md` for a single-user MVP demo under
`apps/<slug>/`. Write the plan **before** writing any code, and commit it with the demo.

## When to use

You have an approved tech pick (a library, framework, API, or technique) and need to build
a small demo app for it in this monorepo.

## Output

Create `apps/<slug>/PLAN.md` (kebab-case slug) with exactly these sections:

### 1. Goal
One or two sentences: what the demo shows and why the tech pick is interesting.
Name the tech pick explicitly.

### 2. Non-goals
Bullet list of what is deliberately out of scope. At minimum, single-user demos exclude:
authentication, persistence beyond what the demo needs, deployment hardening,
mobile support, and test coverage beyond a smoke check.

### 3. Stack
- Runtime and package manager: Bun (`bun install`, `bun run dev`).
- The tech pick itself, with the version you'll use.
- Any minimal supporting libraries — justify each one in a few words.
  Fewer dependencies is better.

### 4. File layout
A short tree of the planned files under `apps/<slug>/`, e.g.:

```
apps/<slug>/
  PLAN.md
  package.json
  README.md
  src/
    index.ts
    ...
```

Every app needs a `package.json` with a `dev` script so `bun run dev` works.

### 5. Acceptance checks
A checklist the finished demo must pass. Always include:

- [ ] `bun install && bun run dev` works from a fresh clone of `apps/<slug>/`.
- [ ] The core feature of the tech pick is visibly demonstrated.
- [ ] At least one **screenshot** of the running app is attached to the PR.
- [ ] At least one **video** of the running app is attached to the PR.
- [ ] No files outside `apps/<slug>/` were modified (except `tracking/seen-bookmarks.json` if asked).

Add 2–4 demo-specific checks (e.g. "creating a todo persists across reload").

## Sizing guidance

Scope the plan so the whole demo is a handful of source files. If the plan needs more than
~10 files or more than ~5 dependencies, cut features until it fits. The demo's job is to
show the tech pick working, not to be a product.
