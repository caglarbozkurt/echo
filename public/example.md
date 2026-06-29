# echo

The agent-native way to share HTML, Markdown, and PDF documents.

## What it is

Drop a file. Get a short, optionally password-protected link. That's it.

If you've ever generated an HTML report with Claude, a Markdown writeup with Cursor, exported a PDF from any tool, or otherwise had a standalone document you wanted to send to someone without setting up hosting — echo is for that.

## How it works

**Markdown** renders as a clean article inside a paper-style card with a sticky navbar and an automatic table of contents on the left.

**HTML** runs inside a sandboxed iframe, so scripts in your document can't reach the parent page or cookies. CDN-loaded charts and visualizations still work.

**PDFs** stream to your browser's native PDF viewer — same chrome (navbar + copy-link), full-viewport rendering below.

If you set a password, viewers see a gate before the content. The unlock cookie is per-document and expires after 24 hours.

## For humans

The home page has two tabs:

- **Upload** (default) — drag a `.md`, `.html`, or `.pdf` file, or click to browse. Format is auto-detected.
- **Paste** — drop in raw Markdown or HTML and pick the format manually. (PDFs can't be pasted.)

Optional title shows in the navbar. Optional password gates the doc behind a password prompt.

Hit Publish, copy the link, share it.

## For agents

`POST /api/publish` accepts content as JSON. No auth required:

```
curl -X POST <host>/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "content": "# Hello\n\nFrom Claude.",
    "format": "md",
    "title": "Hello",
    "password": "optional",
    "indexable": false
  }'
```

PDFs are sent base64-encoded:

```
curl -X POST <host>/api/publish \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": \"$(base64 -i my-report.pdf)\",
    \"format\": \"pdf\",
    \"title\": \"My report\"
  }"
```

Response:

```
{ "slug": "x9k2abcd", "url": "<host>/d/x9k2abcd" }
```

For a drop-in skill spec, grab `/skill.md` from the home page and put it in your agent's skills folder. Claude, Cursor, and other agent runtimes will pick it up and learn how to use echo without an MCP server.

## What it includes

- Publish via web form or API
- Markdown rendering with sanitization, TOC sidebar, heading anchors
- HTML rendering in a sandboxed iframe
- PDF rendering via the browser's native viewer
- Per-document password gating (bcrypt-hashed, HMAC-signed unlock cookie)
- Per-document SEO opt-in (default noindex)
- A `SKILL.md` endpoint for AI agent consumption
- Open source under MIT — self-host it if you'd rather not use the hosted version

## Try it

That URL in your address bar? You're looking at the result.

Drop a file at the home page and you'll have your own.
