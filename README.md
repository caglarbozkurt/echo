# echo

Agent-native HTML/MD sharing. Drop a file, get a short link.

See [DESIGN.md](./DESIGN.md) for design notes and [log.md](./log.md) for the build journal.

## Stack

- **Next.js 15** (App Router) on **Vercel**
- **Supabase** (Postgres) for storage
- `bcryptjs` for per-doc password hashing
- `marked` + `isomorphic-dompurify` for Markdown rendering
- HTML rendered inside a sandboxed iframe (`sandbox="allow-scripts"`)

## Local development

```bash
npm install
cp .env.example .env.local
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ECHO_COOKIE_SECRET
# Generate cookie secret: openssl rand -hex 32
npm run dev
```

Visit http://localhost:3000.

## Deploy

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project (free tier is fine for v0).
2. Once provisioned, open the SQL editor and paste the contents of [`db/schema.sql`](./db/schema.sql). Run it.
3. **Settings → API**: copy `Project URL` and `service_role` key.

### 2. Push to GitHub

```bash
git init
git add -A
git commit -m "Initial commit"
gh repo create echo --private --source=. --push
# Or use the GitHub UI to create a repo and push manually.
```

### 3. Deploy to Vercel

1. [vercel.com](https://vercel.com) → Add New → Project → import the repo.
2. **Environment Variables**:
   - `SUPABASE_URL` — from Supabase Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — same page
   - `ECHO_COOKIE_SECRET` — random hex string (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_BASE_URL` — your production URL (no trailing slash). Update after first deploy if Vercel assigns a different URL.
3. Deploy. Vercel builds and serves automatically on every push.

## Usage

### Publish via API

```bash
curl -X POST https://<your-domain>/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# Hello\n\nThis is a test.",
    "format": "md",
    "password": "optional",
    "title": "Test doc"
  }'
# → { "slug": "abc123xy", "url": "https://<your-domain>/d/abc123xy" }
```

### Publish via web form

Visit the home page, drop a file or paste content, hit Publish.

### Use from an AI agent

A drop-in `SKILL.md` is served at `/skill.md`. Drop it into your Claude / Cursor / other-agent skills folder.

> v0 has no API auth — the web form and `POST /api/publish` are both open. Per-user auth ships with Supabase Auth in v1.

## Architecture

- `src/app/api/publish/route.ts` — publish endpoint (no auth in v0)
- `src/app/d/[slug]/page.tsx` — render with password gate (server action)
- `src/lib/supabase.ts` — server-side Supabase client (service role)
- `src/lib/db.ts` — `getDocBySlug` / `insertDoc` helpers
- `src/lib/auth.ts` — bcrypt password verify + HMAC slug token for unlock cookies
- `src/lib/markdown.ts` — MD → sanitized HTML, with heading IDs and TOC extraction
- `db/schema.sql` — single `documents` table

HTML is rendered inside an `<iframe sandbox="allow-scripts">` for origin isolation. Markdown is sanitized with DOMPurify before render.
