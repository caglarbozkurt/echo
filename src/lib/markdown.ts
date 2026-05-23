import { Marked, type Tokens } from "marked";
import sanitizeHtml from "sanitize-html";

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

        // Render inline content without relying on `this.parser` binding
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

  const rawHtml = m.parse(source) as string;

  const html = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["id"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"],
    },
  });

  return { html, headings };
}
