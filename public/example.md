# echo

The agent-native way to share HTML and Markdown.

## What it is

Drop a file. Get a short, optionally password-protected link. That's it.

If you've ever generated an HTML report with Claude, a Markdown writeup with Cursor, or any standalone document you wanted to send to one person without setting up hosting — echo is for that.

## How it works

Markdown renders as a clean article inside a paper-style card with a sticky navbar and an automatic table of contents on the left.

HTML runs inside a sandboxed iframe, so scripts in your document can't reach the parent page or cookies. CDN-loaded charts and visualizations still work.

If you set a password, viewers see a gate before the content. The unlock cookie is per-document and expires after 24 hours.

## For humans

The home page has two tabs:

- **Upload** (default) — drag a `.md` or `.html` file, or click to browse. Format is auto-detected.
- **Paste** — drop in raw Markdown or HTML and pick the format manually.

Optional title shows in the navbar. Optional password gates the doc behind a password prompt.

Hit Publish, copy the link, share it.

## For agents

`POST /api/publish` accepts content as JSON. No auth in v0:

```
curl -X POST <host>/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# Hello\n\nFrom Claude.",
    "format": "md",
    "title": "Hello",
    "password": "optional"
  }'
```

Response:

```
{ "slug": "x9k2abcd", "url": "<host>/d/x9k2abcd" }
```

For a drop-in skill spec, grab `/skill.md` from the home page and put it in your agent's skills folder. Claude, Cursor, and other agent runtimes will pick it up and learn how to use echo without an MCP server.

## What's in v0

- Publish via web form or API
- Markdown rendering with sanitization, TOC sidebar, heading anchors
- HTML rendering in a sandboxed iframe
- Per-document password gating (bcrypt-hashed, HMAC-signed unlock cookie)
- A SKILL.md endpoint for AI agent consumption
- No accounts, no rate limits, no billing — public alpha

## What's coming

- Accounts via Supabase Auth + per-user API tokens
- Quotas tied to a small free tier and paid plans
- Document versioning (publish updates without changing the URL)
- An MCP server for runtimes that prefer it over SKILL.md
- A machine-readable companion endpoint per doc, so other agents can ingest published content cleanly

## Try it

That URL in your address bar? You're looking at the result.

Drop a file at the home page and you'll have your own.
