import { NextRequest, NextResponse } from "next/server";
import { createDocument, MAX_CONTENT_BYTES } from "@/lib/publish";
import { isDocFormat } from "@/lib/formats";
import { getBaseUrl } from "@/lib/baseUrl";

export const runtime = "nodejs";

const MAX_STRING_FIELD = 200;

// No auth on this endpoint — same risk profile as the unauth'd web form.
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

  if (
    typeof content !== "string" ||
    content.length === 0 ||
    content.length > MAX_CONTENT_BYTES
  ) {
    return NextResponse.json({ error: "invalid_content" }, { status: 400 });
  }
  if (!isDocFormat(format)) {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }
  if (
    password !== undefined &&
    (typeof password !== "string" || password.length > MAX_STRING_FIELD)
  ) {
    return NextResponse.json({ error: "invalid_password" }, { status: 400 });
  }
  if (
    title !== undefined &&
    (typeof title !== "string" || title.length > MAX_STRING_FIELD)
  ) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  }
  if (indexable !== undefined && typeof indexable !== "boolean") {
    return NextResponse.json({ error: "invalid_indexable" }, { status: 400 });
  }

  const slug = await createDocument({
    content,
    format,
    password: typeof password === "string" ? password : null,
    title: typeof title === "string" ? title : null,
    indexable: indexable === true,
  });

  return NextResponse.json({ slug, url: `${getBaseUrl()}/d/${slug}` });
}
