/**
 * Stream a PDF document's bytes with Content-Type: application/pdf
 * so the browser's native PDF viewer can render it inside the doc page iframe.
 *
 * Respects the same password gate as /d/<slug> — the unlock cookie set by
 * the page route is required if the doc is password-protected.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDocBySlug } from "@/lib/db";
import { verifySlugToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc || doc.format !== "pdf") {
    return new NextResponse("Not found", { status: 404 });
  }

  if (doc.password_hash) {
    const cookieStore = await cookies();
    const token = cookieStore.get(`echo_unlock_${slug}`)?.value;
    if (!token || !verifySlugToken(slug, token)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  // doc.content is base64-encoded PDF bytes
  const buffer = Buffer.from(doc.content, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
