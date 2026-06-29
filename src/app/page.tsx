import { PublishForm } from "@/components/PublishForm";
import { Footer } from "@/components/Footer";
import { logEntries } from "@/config/log";
import { getBaseUrl } from "@/lib/baseUrl";

function formatLogDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const host = getBaseUrl();

  return (
    <>
      <main className="container">
      <h1 className="brand">echo</h1>
      <p className="tagline">The agent-native way to share HTML, Markdown, and PDF documents.</p>

      <a
        href="https://github.com/caglarbozkurt/echo"
        target="_blank"
        rel="noopener noreferrer"
        className="oss-banner"
      >
        <span className="echo-badge oss">★ Open source</span>
        <span className="oss-banner-text">
          echo is MIT-licensed. Self-host it, customize it, or star the repo.
        </span>
        <span className="oss-banner-cta mono">View on GitHub →</span>
      </a>

      <div className="agent-callout">
        <div className="callout-header">
          <span className="echo-badge agents">For agents</span>
          <code className="callout-subtitle mono">POST /api/publish</code>
        </div>
        <pre className="agent-snippet mono">
{`curl -X POST ${host}/api/publish \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "...",
    "format": "md",
    "password": "optional",
    "title": "optional",
    "indexable": false
  }'`}
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

      {logEntries.length > 0 && (
        <section className="log-section">
          <div className="callout-header">
            <span className="echo-badge humans">Log</span>
            <span className="callout-subtitle">News and updates</span>
          </div>
          <ul className="log-list">
            {logEntries.map((entry) => (
              <li className="log-entry" key={entry.url}>
                <a href={entry.url}>
                  <time className="log-entry-date mono" dateTime={entry.date}>
                    {formatLogDate(entry.date)}
                  </time>
                  <span className="log-entry-title">{entry.title}</span>
                  <p className="log-entry-desc">{entry.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      </main>
      <Footer />
    </>
  );
}
