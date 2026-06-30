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
        <p className="tagline">
          The agent-native way to share HTML, Markdown, and PDF documents.
        </p>

        <a
          href="https://github.com/caglarbozkurt/echo"
          target="_blank"
          rel="noopener noreferrer"
          className="oss-banner"
        >
          <svg
            className="oss-banner-icon"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <div className="oss-banner-content">
            <div className="oss-banner-title">Open source on GitHub</div>
            <div className="oss-banner-text">
              echo is MIT-licensed. Self-host it, customize it, or star the repo.
            </div>
          </div>
          <div className="oss-banner-badges">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/github/stars/caglarbozkurt/echo?style=flat-square&logo=github&logoColor=white&color=4f46e5&labelColor=0f172a"
              alt="GitHub stars"
              height="24"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/badge/License-MIT-4f46e5?style=flat-square&labelColor=0f172a"
              alt="MIT License"
              height="24"
            />
          </div>
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
