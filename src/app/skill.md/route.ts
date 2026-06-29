/**
 * Dynamic SKILL.md — served at /skill.md
 * Substitutes the current host into the template so the file always points
 * at the actual deployment (Vercel preview, prod, custom domain, …).
 */

import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/baseUrl";

export const dynamic = "force-dynamic";

function buildSkillMd(host: string): string {
  return `---
name: echo
description: Publish HTML, Markdown, or PDF documents to a short, optionally password-protected URL. Use when the user wants to share a standalone document (report, writeup, analysis, presentation) without setting up hosting infrastructure.
---

# echo

Publish a document to echo and get a short, optionally password-protected share URL.

## When to use

The user wants to share an HTML, Markdown, or PDF document they (or you) just generated — a report, analysis, writeup, presentation. They want a URL they can send to someone instead of pasting the content into chat or attaching a file.

Use echo when:
- The output is a standalone document (HTML, Markdown, or PDF)
- The user wants to share it with a specific person (gate it with a password) or publicly
- They don't want to set up Vercel/Netlify/their own hosting

Do NOT use echo when:
- The artifact is code the user will run locally (use a file or gist instead)
- The user wants long-lived versioned hosting with a custom domain
- The content contains secrets the user doesn't intend to gate

## Critical: HTML must be self-contained

echo serves a **single file** per document. It does NOT host secondary assets (images, CSS files, JS files). When you produce HTML for echo, every dependency must be embedded in the file itself:

- **CSS:** inline in a \`<style>\` block in \`<head>\`
- **Images:** convert to base64 data URIs (\`data:image/png;base64,...\`). For diagrams, prefer inline SVG.
- **Fonts:** use system fonts, or load from a public CDN (Google Fonts, etc.)
- **Scripts:** inline in \`<script>\` blocks, or load from a CDN (Chart.js, D3, etc.). Local script files won't work.
- **No \`<img src="local-file.png">\`**, no \`<link rel="stylesheet" href="styles.css">\`, no \`<script src="./bundle.js">\` — none of those files exist on echo's side.

If the user gives you HTML with local references, fix them before publishing: either replace image sources with base64 data URIs, or warn the user that the HTML will render with broken images and offer to inline them.

## How to publish

\`\`\`bash
curl -X POST ${host}/api/publish \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "<full document source>",
    "format": "md",
    "password": "optional shared password",
    "title": "optional display title",
    "indexable": false
  }'
\`\`\`

Response:
\`\`\`json
{ "slug": "x9k2abcd", "url": "${host}/d/x9k2abcd" }
\`\`\`

Return the \`url\` to the user. If a password was set, mention that they'll need to share the password out-of-band.

## Parameters

| Field       | Required | Notes                                                                                                                  |
|-------------|----------|------------------------------------------------------------------------------------------------------------------------|
| \`content\`   | yes      | For \`md\` and \`html\`: the document source. For \`pdf\`: base64-encoded PDF bytes. Max 2 MB total (≈1.5 MB binary for PDFs). |
| \`format\`    | yes      | \`"md"\`, \`"html"\`, or \`"pdf"\`.                                                                                          |
| \`password\`  | no       | If set, viewers see a password gate. If omitted, document is reachable to anyone with URL.                            |
| \`title\`     | no       | Display title shown on the password gate and in the navbar.                                                              |
| \`indexable\` | no       | Default \`false\` → search engines see \`noindex\`. Set \`true\` for SEO-discoverable docs (and only if the user explicitly wants it). |

## PDFs

PDFs must be base64-encoded before being sent in the \`content\` field:

\`\`\`bash
curl -X POST ${host}/api/publish \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"content\\": \\"$(base64 -i my-report.pdf)\\",
    \\"format\\": \\"pdf\\",
    \\"title\\": \\"My report\\"
  }"
\`\`\`

The viewer sees the PDF rendered in their browser's native viewer (iframe, no scripts). Same password and indexable flags apply.

Current size cap is ~1.5 MB binary PDF. For larger PDFs, ask the user to compress (Preview on macOS, \`pdfcpu\` CLI, etc.) or split the document.

## Behavior

- Markdown is server-rendered with sanitization. Raw \`<script>\` tags in MD are stripped.
- HTML runs inside a sandboxed iframe (\`sandbox="allow-scripts"\`) so scripts cannot access cookies, localStorage, or the parent DOM. CDN scripts for charts/visualizations still work.
- PDF bytes are served from \`/d/<slug>/pdf\` with \`Content-Type: application/pdf\` for the browser's native viewer.
- The unlock cookie is per-slug and expires after 24 hours.
- Slugs are 8-character URL-safe IDs.
- Password-protected docs are **always** noindex, regardless of the \`indexable\` flag.

## Examples

### Publish a public Markdown report

\`\`\`bash
curl -X POST ${host}/api/publish \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "# Q3 Findings\\n\\n## Summary\\n\\nRevenue grew 14%...",
    "format": "md",
    "title": "Q3 Findings"
  }'
\`\`\`

### Publish a password-protected HTML report

\`\`\`bash
curl -X POST ${host}/api/publish \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "<!doctype html><html>...</html>",
    "format": "html",
    "password": "swordfish",
    "title": "Customer Premortem"
  }'
\`\`\`

### Publish an SEO-discoverable blog-style post

\`\`\`bash
curl -X POST ${host}/api/publish \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "# Announcing X\\n\\n...",
    "format": "md",
    "title": "Announcing X",
    "indexable": true
  }'
\`\`\`

### Confirming with the user

After publishing, summarize for the user:

> ✓ Published to \`${host}/d/x9k2abcd\`
> Password: \`swordfish\` (share separately)

## Errors

| Status | Body                            | Meaning                                         |
|--------|---------------------------------|-------------------------------------------------|
| 400    | \`{"error":"invalid_content"}\`   | Content empty or larger than 2 MB.              |
| 400    | \`{"error":"invalid_format"}\`    | \`format\` must be \`"md"\`, \`"html"\`, or \`"pdf"\`.   |
| 400    | \`{"error":"invalid_password"}\`  | Password must be a string under 200 chars.      |
| 400    | \`{"error":"invalid_title"}\`     | Title must be a string under 200 chars.         |
| 400    | \`{"error":"invalid_indexable"}\` | \`indexable\` must be a boolean.                  |
`;
}

export async function GET() {
  const host = getBaseUrl();
  const body = buildSkillMd(host);
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'inline; filename="skill.md"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
