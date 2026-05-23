---
type: project
status: scaffolding
created: 2026-05-23
---

# echo

Agent-native HTML/MD sharing. Drop a file, get a password-protected short link.

> "Echo this to my team."

## Status

**v0 scaffolding** — Next.js app for personal use (just me + cofounder). No accounts, no billing, single API token. Validate the workflow before building anything else.

## Links

- [[DESIGN]] — problem, scope, stack, schema, endpoints, security notes
- [[log]] — chronological notes and decisions
- `README.md` — run instructions (for future-me coming to this fresh)
- Repo: *not pushed yet*
- Live URL: *not deployed yet*

## v0 scope (this build)

- `POST /api/publish` — Bearer token auth, body is HTML or MD + optional password, returns short URL
- `GET /d/<slug>` — render with password gate (server-side, cookie-based)
- No user model, no dashboard, no landing page beyond a placeholder

## Out of scope until v0 works for me

- Accounts, billing, dashboard
- Marketing landing page (the agents/humans split)
- MCP server (comes next — the publish API is the shape an MCP would wrap)
- Versioning, machine-readable companion view, scoped tokens, audit log
