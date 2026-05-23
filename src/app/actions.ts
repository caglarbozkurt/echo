"use server";

import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { insertDoc } from "@/lib/db";

export async function publishFromForm(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const formatRaw = String(formData.get("format") ?? "md");
  const title = String(formData.get("title") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");

  if (!content) redirect("/?error=empty");
  if (formatRaw !== "html" && formatRaw !== "md") redirect("/?error=format");
  const format = formatRaw as "html" | "md";

  const slug = nanoid(8);
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  await insertDoc({
    slug,
    format,
    content,
    password_hash: passwordHash,
    title,
  });

  redirect(`/published/${slug}`);
}
