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
description: Publish HTML or Markdown documents to a short, optionally password-protected URL. Use when the user wants to share a standalone document (report, writeup, analysis, presentation) without setting up hosting infrastructure.
---

# echo

Publish a document to echo and get a short, optionally password-protected share URL.

## When to use

The user wants to share an HTML or Markdown document they (or you) just generated — a report, analysis, writeup, presentation. They want a URL they can send to someone instead of pasting the content into chat or attaching a file.

Use echo when:
- The output is a standalone HTML or Markdown document (not a chat reply, not source code meant to be executed)
- The user wants to share it with a specific person (gate it with a password) or publicly
- They don't want to set up Vercel/Netlify/their own hosting

Do NOT use echo when:
- The artifact is code the user will run locally (use a file or gist instead)
- The user wants long-lived versioned hosting with a custom domain
- The content contains secrets the user doesn't intend to gate

## Generating HTML for echo

When you produce HTML for echo, make it **self-contained**: inline all CSS in a \`<style>\` block, prefer CDN scripts over local files. echo serves a single file per document and does not host secondary assets.

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

| Field       | Required | Notes                                                                                       |
|-------------|----------|---------------------------------------------------------------------------------------------|
| \`content\`   | yes      | Full document source. Max 2 MB.                                                             |
| \`format\`    | yes      | \`"md"\` for Markdown, \`"html"\` for HTML.                                                       |
| \`password\`  | no       | If set, viewers see a password gate. If omitted, document is reachable to anyone with URL.  |
| \`title\`     | no       | Display title shown on the password gate and in the navbar.                                  |
| \`indexable\` | no       | Default \`false\` → search engines see \`noindex\`. Set \`true\` for SEO-discoverable docs (and only if the user explicitly wants it). |

## Behavior

- Markdown is server-rendered with sanitization. Raw \`<script>\` tags in MD are stripped.
- HTML runs inside a sandboxed iframe (\`sandbox="allow-scripts"\`) so scripts cannot access cookies, localStorage, or the parent DOM. CDN scripts for charts/visualizations still work.
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
| 400    | \`{"error":"invalid_format"}\`    | \`format\` must be \`"md"\` or \`"html"\`.            |
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
