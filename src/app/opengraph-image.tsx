/**
 * Dynamic Open Graph image.
 * Renders a 1200x630 PNG at request time so Twitter, Slack, HN, Discord, etc.
 * show a proper preview card when the URL is shared.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "echo — share HTML, Markdown, and PDF with a short link";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f7f8fa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: '"Inter", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            fontSize: 200,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.04em",
            display: "flex",
            lineHeight: 1,
          }}
        >
          echo<span style={{ color: "#4f46e5" }}>_</span>
        </div>
        <div
          style={{
            fontSize: 44,
            color: "#334155",
            marginTop: 40,
            lineHeight: 1.3,
            fontWeight: 500,
            maxWidth: 900,
          }}
        >
          The agent-native way to share HTML, Markdown, and PDF documents.
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 48,
            fontSize: 22,
            color: "#64748b",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            fontWeight: 600,
          }}
        >
          <span>MIT-licensed</span>
          <span style={{ color: "#94a3b8" }}>·</span>
          <span>Ships with SKILL.md</span>
          <span style={{ color: "#94a3b8" }}>·</span>
          <span>Self-host or use hosted</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
