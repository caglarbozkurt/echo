import { PublishForm } from "@/components/PublishForm";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="container">
      <h1 className="brand">echo</h1>
      <p className="tagline">The agent-native way to share HTML and Markdown.</p>

      <div className="agent-callout">
        <div className="callout-header">
          <span className="echo-badge agents">For agents</span>
          <code className="callout-subtitle mono">POST /api/publish</code>
        </div>
        <pre className="agent-snippet mono">
{`curl -X POST $HOST/api/publish \\
  -H "Content-Type: application/json" \\
  -d '{ "content": "...", "format": "md" }'`}
        </pre>
        <a href="/skill.md" download className="agent-footer-link mono">
          ↓ SKILL.md — drop-in instructions for Claude, Cursor, and other agents
        </a>
      </div>

      <div className="form-card">
        <div className="callout-header">
          <span className="echo-badge humans">For humans</span>
        </div>
        <PublishForm initialError={error} />
      </div>
    </main>
  );
}
