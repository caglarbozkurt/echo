import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";

function formatDate(d: Date | string | undefined | null): string | null {
  if (!d) return null;
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BrandHeader({
  title,
  createdAt,
  shareUrl,
}: {
  title?: string | null;
  createdAt?: Date | string | null;
  shareUrl?: string;
}) {
  const dateStr = formatDate(createdAt);
  const hasMeta = Boolean(title || dateStr);

  return (
    <header className="doc-header">
      <Link href="/" className="doc-header-brand">
        echo<span className="doc-header-cursor">_</span>
      </Link>
      {hasMeta && (
        <div className="doc-header-meta">
          {title && <span className="doc-header-title">{title}</span>}
          {title && dateStr && <span className="doc-header-sep">·</span>}
          {dateStr && <span className="doc-header-date mono">{dateStr}</span>}
        </div>
      )}
      {shareUrl && (
        <div className="doc-header-actions">
          <CopyButton text={shareUrl} label="Copy link" className="small" />
        </div>
      )}
    </header>
  );
}
