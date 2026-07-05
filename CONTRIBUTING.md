# Contributing to echo

Thanks for your interest — here's how contributions work in practice.

## Issues

Bug reports, feature ideas, and questions are welcome. Open an issue on GitHub with enough context to reproduce (browser, doc format, a minimal example when the content is public).

## Pull requests

**For anything non-trivial** — new features, architectural changes, large refactors — **please open an issue first** so we can discuss the direction. This avoids you spending time on something that might not merge because it doesn't fit where echo is going.

**Small fixes** — typos, docs, bugs with a clear cause — open a PR directly, no issue required.

## Development

See [README.md](./README.md#quick-start) for the full setup. Short version:

```bash
git clone https://github.com/caglarbozkurt/echo.git
cd echo
npm install
cp .env.example .env.local   # fill in Supabase URL + secret key + cookie secret
npm run dev
```

## Style

- TypeScript, no `any` unless justified
- Small, focused commits with descriptive messages
- Match the existing code style — the codebase is deliberately small and readable
- No new dependencies without a clear reason

## Scope

echo is deliberately narrow: **share HTML, Markdown, or PDF documents with a short, optionally password-protected link — with a first-class agent surface (`SKILL.md`)**. Features that widen the scope significantly (user accounts, team workspaces, custom per-user domains, etc.) may not fit right now.

If you're unsure whether a change is in scope, open an issue and ask.

## No support obligation

echo is a side project I run for free. I'll do my best to respond to issues, but I can't guarantee timing. Self-hosting is a first-class path — the entire codebase is here for you to fork and customize.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
