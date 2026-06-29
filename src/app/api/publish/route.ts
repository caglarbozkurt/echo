import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { insertDoc } from "@/lib/db";
import { getBaseUrl } from "@/lib/baseUrl";

export const runtime = "nodejs";

const FORMATS = new Set(["html", "md", "pdf"]);
const MAX_CONTENT = 2 * 1024 * 1024;

// v0: no auth on this endpoint. Same risk profile as the web form (also unauth'd).
// Real auth (per-user tokens) ships with Supabase Auth in v1.
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { content, format, password, title, indexable } = (body ?? {}) as {
    content?: unknown;
    format?: unknown;
    password?: unknown;
    title?: unknown;
    indexable?: unknown;
  };

  if (typeof content !== "string" || content.length === 0 || content.length > MAX_CONTENT) {
    return NextResponse.json({ error: "invalid_content" }, { status: 400 });
  }
  if (typeof format !== "string" || !FORMATS.has(format)) {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }
  if (password !== undefined && (typeof password !== "string" || password.length > 200)) {
    return NextResponse.json({ error: "invalid_password" }, { status: 400 });
  }
  if (title !== undefined && (typeof title !== "string" || title.length > 200)) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  }
  if (indexable !== undefined && typeof indexable !== "boolean") {
    return NextResponse.json({ error: "invalid_indexable" }, { status: 400 });
  }

  const slug = nanoid(8);
  const passwordHash =
    typeof password === "string" && password.length > 0 ? await bcrypt.hash(password, 10) : null;

  await insertDoc({
    slug,
    format: format as "html" | "md" | "pdf",
    content,
    password_hash: passwordHash,
    title: typeof title === "string" ? title : null,
    indexable: indexable === true,
  });

  return NextResponse.json({ slug, url: `${getBaseUrl()}/d/${slug}` });
}
