---
type: log
project: echo
---

# echo — Project Log

Chronological notes. Newest at top.

---

## 2026-05-23 — Backend: Supabase + ready to deploy

- Swapped `src/lib/db.ts` from in-memory `Map` to Supabase via `@supabase/supabase-js`. Same `getDocBySlug` / `insertDoc` interface — single-file change as planned.
- New `src/lib/supabase.ts` mirroring miyagi's pattern: server-only client with service role key, env validated at import.
- Dropped `@vercel/postgres` from package.json (was unused after the original Postgres scaffold was swapped to in-memory).
- Deleted `scripts/init-db.mjs` — schema is applied via Supabase SQL editor now (one-time paste).
- Updated `db/schema.sql` to miyagi style: header comment block, `TIMESTAMP WITH TIME ZONE`, `idx_documents_created_at` index, `COMMENT ON` for table and columns.
- `.env.example` reduced to: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `ECHO_COOKIE_SECRET`. No browser Supabase client for v0 (no client-side auth yet).
- README rewritten for deploy: Supabase setup → GitHub push → Vercel import → env vars. Three-step.

## 2026-05-23 — UX iteration v6: masthead navbar + TOC for MD

- **BrandHeader → centered masthead style.** Logo on top, title + created-at on the line below in small muted text (`{title} · {date}`). Date formatted "May 23, 2026". Header height ~76px.
- **TOC for Markdown docs.** Extracts `h2`/`h3` from the source, renders a sticky left column. `h3` indented under its `h2`. Hover state: text darkens, left-border colors to indigo. Hidden on viewports < 1024px.
- New `parseMarkdown(source) → { html, headings }` replaces `renderMarkdown`. Heading IDs slugified from source, injected via regex post-render. Anchor links scroll-margin-top adjusted so jumps land below the sticky header.
- HTML iframe height adjusted (`100vh - 76px`) to match the taller masthead.
- Left-aligned big brand on home/published kept as-is — those are hero treatments, not navigation.

## 2026-05-23 — UX iteration v5: badge parity + auto-detect on upload

- **Shared `.echo-badge` class** with `agents` (filled indigo) and `humans` (outlined white) variants. Both sit at the top of their card via a `.callout-header` row. "For humans" now has the same visual weight as "For agents".
- **Format toggle hidden in Upload mode.** It's auto-detected from file extension, so the toggle is dead UI there. Visible only in Paste mode. Hidden input still carries `format` value either way.
- Replaced format radios with React-managed buttons (`.format-option`) — cleaner state model, single source of truth in a hidden input.
- Consistency audit: all main cards (`.agent-callout`, `.form-card`, `.published-card`, `.password-gate`, `.doc-article`) share 2px border, 10px radius, hard `4px 4px 0` shadow. ✓
- Removed `.section-label`, `.agent-callout-header`, `.agent-badge`, `.agent-endpoint` (consolidated into shared `.echo-badge` + `.callout-header` + `.callout-subtitle`).

## 2026-05-23 — UX iteration v4: cooler palette + auth removed for v0

- **Auth removed from `POST /api/publish`.** The bearer-token check was inconsistent with the open web form. v0 is intentionally unauth'd on both surfaces; per-user auth ships with Supabase Auth in v1. SKILL.md, README, page.tsx curl snippet all updated to drop the `Authorization: Bearer` header.
- **Palette shift from warm/candy to cool/dev-tooly:**
  - Background: warm peach (`#fef3e9`) → cool light gray (`#f7f8fa`)
  - Accent: coral (`#ff5470`) → indigo (`#4f46e5`)
  - Borders/text: near-black → slate-900 (`#0f172a`) — slight cool tint, harmonizes with bg
  - "File loaded" state: mint → teal-100 (`#ccfbf1`)
  - Agent callout bg: soft pink → soft indigo (`#eef2ff`)
- Keeps everything Glitch-y: 2px solid borders, hard `4px 4px 0` offset shadows, press-in button hover, dot grid bg. Just the temperature shifted.

## 2026-05-23 — SKILL.md added

- Added `public/skill.md` — drop-in instructions for AI agents (Claude/Cursor/etc.) to publish to echo without needing an MCP server.
- Frontmatter (`name`, `description`) follows Anthropic's skill format so the trigger is clear; body documents endpoint, params, examples, error codes.
- Linked from the agent callout on the home page with a coral underline: "↓ SKILL.md — drop-in instructions for Claude, Cursor, and other agents". Uses `download` attribute so clicking saves the file.
- This is the first concrete instance of echo being agent-native beyond just having a JSON endpoint. SKILL.md > MCP-only for distribution: works in any skills-capable agent, no install step.

## 2026-05-23 — UX iteration v3 (Glitch-style)

- Aesthetic shift toward Glitch's blog style: warm peach background with subtle dot grid, **2px solid black borders**, **hard offset shadows** (`4px 4px 0`, no blur), coral accent (`#ff5470`) replacing green.
- Buttons get the signature "press in" interaction: hover translates +2px/+2px and shrinks shadow to `2px 2px 0`; active translates +4px/+4px and shadow goes flat.
- Article page (MD) now renders inside a white "paper" card with the same border + hard-shadow treatment.
- Dropzone, tabs, inputs, agent callout — all updated to 2px solid borders.
- New `BrandHeader` component (small monospace `echo_` wordmark, links to `/`) added at top of all doc pages (article, HTML iframe, password gate). Sticky with bottom border.
- Active tab and format toggle now use coral fill instead of subtle gray.

## 2026-05-23 — UX iteration v2

- Primary action is now **Upload** (drag-drop or click-to-browse), Paste secondary. Segmented-control tabs.
- File upload auto-detects format from extension (`.md`/`.markdown` → MD; `.html`/`.htm` → HTML).
- Agent section moved **above** the human form — compact terminal-styled card showing the curl shape. Signals "agent-native" right away.
- Refined aesthetic: soft radial gradient from top, white form card with subtle shadow, segmented-control tabs, monospaced field labels for tech feel, micro-lift hover on submit button.
- Form card visually contains everything, agent callout stands alone above as a "for agents" announcement.

## 2026-05-23 — Pivot to UX-first (in-memory dev store)

- Decision: skip DB integration until the UX feels right. Validate the publish/view flow with stub storage first.
- `src/lib/db.ts` swapped to an in-memory `Map` (persists across HMR via globalThis, lost on server restart).
- Same `getDocBySlug` / `insertDoc` interface — Postgres impl can drop back in unchanged.
- Added a real publish form on `/` (textarea, MD/HTML toggle, optional title + password) with server-action submission.
- Added `/published/<slug>` success page with copy-link button.
- Brand aesthetic: monospace `echo_` wordmark with blinking cursor, minimal palette (white + soft green accent), sharp 6px corners.

## 2026-05-23 — Project scaffolded

- Name chosen: `echo` (Unix-coded, sharing metaphor, verb you'd actually say). Reserve right to rename later — branding will focus on this feeling.
- Anchored on Tiiny.host as feature-scope reference but **not cloning** — their UI is dated and most of their feature surface (themes, fonts, file managers) doesn't matter for AI users.
- Differentiator: agent-native. v1+ will add MCP server, versioning, machine-readable companion view, scoped tokens.
- Pricing direction (deferred): $9/mo + free tier. Target ~$300 MRR achievable with ~34 paying users.
- v0 is just me + cofounder. No accounts, no dashboard, no landing page. Single Bearer token, password-gated render.
- Stack: Next.js 15 + Neon Postgres on Vercel. Inline content in Postgres (no Blob needed for v0).
- See [[DESIGN]] for full design notes.

---
