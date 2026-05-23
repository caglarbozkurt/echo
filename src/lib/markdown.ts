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

export function parseMarkdown(source: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const seen = new Set<string>();

  const marked = new Marked();

  marked.use({
    renderer: {
      heading(token: Tokens.Heading): string {
        // Render inner content with inline formatting (bold, code, links, etc.)
        let innerHtml: string;
        try {
          innerHtml = this.parser.parseInline(token.tokens);
        } catch {
          innerHtml = token.text;
        }

        const base = slugify(token.text) || "section";
        let candidate = base;
        let n = 1;
        while (seen.has(candidate)) {
          candidate = `${base}-${n++}`;
        }
        seen.add(candidate);

        headings.push({ level: token.depth, text: token.text, id: candidate });

        return `<h${token.depth} id="${candidate}">${innerHtml}</h${token.depth}>\n`;
      },
    },
  });

  const html = marked.parse(source) as string;
  return {
    html: DOMPurify.sanitize(html, { ADD_ATTR: ["id"] }),
    headings,
  };
}
