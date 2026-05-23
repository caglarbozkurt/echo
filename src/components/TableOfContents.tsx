import type { Heading } from "@/lib/markdown";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const toc = headings.filter((h) => h.level === 2 || h.level === 3);
  if (toc.length === 0) return null;

  return (
    <aside className="doc-toc" aria-label="Table of contents">
      <div className="doc-toc-label">Contents</div>
      <ul>
        {toc.map((h) => (
          <li key={h.id} className={`toc-level-${h.level}`}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
