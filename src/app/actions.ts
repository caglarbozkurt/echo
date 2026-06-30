"use server";

import { redirect } from "next/navigation";
import { createDocument } from "@/lib/publish";
import { isDocFormat } from "@/lib/formats";

export async function publishFromForm(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const formatRaw = String(formData.get("format") ?? "md");
  const title = String(formData.get("title") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "") || null;
  const indexable = formData.get("indexable") === "on";

  if (!content) redirect("/?error=empty");
  if (!isDocFormat(formatRaw)) redirect("/?error=format");

  const slug = await createDocument({
    content,
    format: formatRaw,
    password,
    title,
    indexable,
  });

  redirect(`/published/${slug}`);
}
