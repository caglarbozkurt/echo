import { Marked, type Tokens } from "marked";
import DOMPurify from "isomorphic-dompurify";

export type Heading = {
  level: number;
  text: string;
  id: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function parseMarkdown(source: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const seen = new Set<string>();

  const m = new Marked();

  m.use({
    renderer: {
      heading(token: Tokens.Heading): string {
        const base = slugify(token.text) || "section";
        let candidate = base;
        let n = 1;
        while (seen.has(candidate)) {
          candidate = `${base}-${n++}`;
        }
        seen.add(candidate);
        headings.push({ level: token.depth, text: token.text, id: candidate });

        // Render inline content (bold, code, links, etc.) without relying on
        // a `this.parser` binding — m.parseInline handles inline tokens reliably
        // across dev and production builds.
        let inner: string;
        try {
          inner = m.parseInline(token.text) as string;
        } catch {
          inner = escapeHtml(token.text);
        }

        return `<h${token.depth} id="${candidate}">${inner}</h${token.depth}>\n`;
      },
    },
  });

  const html = m.parse(source) as string;
  return {
    html: DOMPurify.sanitize(html, { ADD_ATTR: ["id"] }),
    headings,
  };
}
