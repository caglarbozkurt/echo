/**
 * Single source of truth for the document format literal.
 * Used by the API, the server action, the form, the render page, and the DB type.
 */

export const DOC_FORMATS = ["md", "html", "pdf"] as const;
export type DocFormat = (typeof DOC_FORMATS)[number];

export function isDocFormat(value: unknown): value is DocFormat {
  return typeof value === "string" && (DOC_FORMATS as readonly string[]).includes(value);
}

const FORMAT_LABELS: Record<DocFormat, string> = {
  md: "Markdown",
  html: "HTML",
  pdf: "PDF",
};

export function formatLabel(format: DocFormat): string {
  return FORMAT_LABELS[format];
}
