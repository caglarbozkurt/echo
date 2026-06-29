/**
 * Document store — Supabase-backed.
 */

import { supabase, type DocumentRow } from "@/lib/supabase";

export type DocRow = {
  slug: string;
  format: "html" | "md" | "pdf";
  content: string;
  password_hash: string | null;
  title: string | null;
  indexable: boolean;
  created_at: Date;
};

function rowToDoc(row: DocumentRow): DocRow {
  return {
    ...row,
    created_at: new Date(row.created_at),
  };
}

export async function getDocBySlug(slug: string): Promise<DocRow | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("slug, format, content, password_hash, title, indexable, created_at")
    .eq("slug", slug)
    .maybeSingle<DocumentRow>();

  if (error) {
    console.error("getDocBySlug error", error);
    return null;
  }
  return data ? rowToDoc(data) : null;
}

export async function insertDoc(doc: Omit<DocRow, "created_at">): Promise<void> {
  const { error } = await supabase.from("documents").insert({
    slug: doc.slug,
    format: doc.format,
    content: doc.content,
    password_hash: doc.password_hash,
    title: doc.title,
    indexable: doc.indexable,
  });

  if (error) {
    console.error("insertDoc error", error);
    throw new Error(`Failed to insert document: ${error.message}`);
  }
}
