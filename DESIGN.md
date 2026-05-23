---
type: design
project: echo
updated: 2026-05-23
---

# echo — v0 Design

## Problem

I generate HTML reports and Markdown docs with Claude all the time (Orbion premortems, side-project writeups, ad-hoc analyses). Sharing them with a teammate requires either: spinning up infra (slow), pasting into Notion (loses fidelity for HTML), or using a paid third-party (Tiiny et al. — fine but not agent-native).

## Target user (v0)

Just me + cofounder. No external users until the workflow proves out for the two of us.

## Target user (eventual)

Individual AI users and indie hackers who generate HTML/MD artifacts and need a password-protected short link without infra setup. Self-serve only, no sales.

## v0 scope

**In:**
- `POST /api/publish` — single endpoint, Bearer token auth
- `GET /d/<slug>` — render route with password gate
- `GET /skill.md` — static SKILL.md served from `public/`, drop-in instructions for AI agents to publish to echo without an MCP server
- Storage: Postgres (Neon via Vercel integration). Content stored inline as TEXT (HTML/MD reports fit comfortably).
- Markdown rendering server-side with sanitization
- HTML rendering inside a sandboxed iframe (security isolation)

**Out:**
- User accounts, login, billing
- Dashboard / document list
- Landing page (placeholder only)
- MCP server (next iteration)
- Versioning, machine-readable view, scoped tokens, audit log
- Custom domains, themes, branding

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | Vercel-native, server actions handle the password form cleanly |
| Hosting | Vercel | Lowest-friction deploy, free tier covers v0 |
| Database | Neon Postgres (via Vercel) | Free tier, serverless, simple |
| File storage | None (inline TEXT in Postgres) | Reports are small. Add Blob later if needed |
| Markdown | `marked` + `isomorphic-dompurify` | Tiny deps, good defaults |
| Password hash | `bcryptjs` | Pure JS, works on Vercel edge/node |
| Slug generation | `nanoid` (8 chars, URL-safe) | ~218 trillion possibilities at 8 chars |

## Schema

```sql
CREATE TABLE documents (
  slug TEXT PRIMARY KEY,
  format TEXT NOT NULL CHECK (format IN ('html', 'md')),
  content TEXT NOT NULL,
  password_hash TEXT,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

That's it. No users table; v0 auth is a single shared API token in `ECHO_API_TOKEN` env var.

## Endpoints

### `POST /api/publish`

```
Headers: Authorization: Bearer <ECHO_API_TOKEN>
Body (JSON): {
  content: string,        // HTML or Markdown source
  format: "html" | "md",
  password?: string,      // optional
  title?: string
}
Response: { url: string, slug: string }
```

### `GET /d/<slug>`

- No password: render content (MD → sanitized HTML; HTML → sandboxed iframe).
- Password set, no cookie: show password form.
- Password set, valid cookie: render content.

### `POST /d/<slug>` (server action)

Accepts password from form. If valid, sets `unlocked_<slug>` cookie (HttpOnly, SameSite=Lax, short expiry) and redirects.

## Security notes

1. **HTML rendering is sandboxed.** Uploaded HTML runs inside `<iframe sandbox="allow-scripts">` via `srcDoc`. Sandbox treats it as a unique origin → cannot access parent cookies, localStorage, or DOM. Charts and inline JS still work.
2. **Passwords are bcrypt-hashed** (cost factor 10).
3. **Unlock cookie is per-slug**, HttpOnly, signed with `ECHO_COOKIE_SECRET`. Knowing one slug doesn't unlock another.
4. **API token is a single shared secret** in env. Fine for personal use; replace with per-user tokens when accounts exist.
5. **No rate limiting in v0.** Acceptable since the token is private. Add when public.
6. **Content sanitization:** MD goes through DOMPurify before render. HTML doesn't, but the iframe sandbox handles it.

## Pricing (deferred)

Per earlier conversation: $9/mo at launch, free tier (3 docs, 100 visitors), Tiiny.host as anchor. Not relevant for v0.

## Open questions

- **Expiry / TTL:** worth adding to v0? Probably yes, even just `expires_at` column nullable. Defer client-facing UI.
- **View counter:** trivial to add (`view_count` column, increment on render). Nice-to-have, not v0.
- **Custom slug:** allow `POST /api/publish` to specify slug? Useful for memorable URLs but adds collision-handling. Defer.
- **Edge runtime vs Node:** bcrypt needs Node. `nanoid` works on both. Run API routes on Node for simplicity.
