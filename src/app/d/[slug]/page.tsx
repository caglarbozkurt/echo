import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getDocBySlug, type DocRow } from "@/lib/db";
import { verifyPassword, signSlugToken, verifySlugToken } from "@/lib/auth";
import { parseMarkdown } from "@/lib/markdown";
import { BrandHeader } from "@/components/BrandHeader";
import { TableOfContents } from "@/components/TableOfContents";

export const dynamic = "force-dynamic";

function buildShareUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  return `${base}/d/${slug}`;
}

export default async function DocPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();

  if (!doc.password_hash) {
    return renderDoc(doc, slug);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(`echo_unlock_${slug}`)?.value;
  if (token && verifySlugToken(slug, token)) {
    return renderDoc(doc, slug);
  }

  // Password gate — no shareUrl, no copy button. Link isn't useful before unlock.
  return (
    <>
      <BrandHeader title={doc.title} createdAt={doc.created_at} />
      <main className="password-gate">
        <h2>{doc.title || "Protected document"}</h2>
        <p>Enter the password to view this document.</p>
        <form action={unlockAction}>
          <input type="hidden" name="slug" value={slug} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            autoComplete="current-password"
          />
          <button type="submit" className="btn-primary">
            Unlock
          </button>
        </form>
        {error === "1" && (
          <p className="error-msg" style={{ marginTop: 16 }}>
            Wrong password.
          </p>
        )}
      </main>
    </>
  );
}

async function unlockAction(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!slug) redirect("/");

  const doc = await getDocBySlug(slug);
  if (!doc || !doc.password_hash) redirect(`/d/${slug}`);

  const ok = await verifyPassword(password, doc.password_hash);
  if (!ok) redirect(`/d/${slug}?error=1`);

  const token = signSlugToken(slug);
  const cookieStore = await cookies();
  cookieStore.set(`echo_unlock_${slug}`, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/d/${slug}`,
    maxAge: 60 * 60 * 24,
  });
  redirect(`/d/${slug}`);
}

function renderDoc(doc: DocRow, slug: string) {
  const shareUrl = buildShareUrl(slug);

  if (doc.format === "md") {
    const { html, headings } = parseMarkdown(doc.content);
    const hasToc = headings.some((h) => h.level === 2 || h.level === 3);
    return (
      <>
        <BrandHeader title={doc.title} createdAt={doc.created_at} shareUrl={shareUrl} />
        <div className={hasToc ? "doc-layout" : "doc-layout no-toc"}>
          {hasToc && <TableOfContents headings={headings} />}
          <article className="doc-article" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </>
    );
  }
  return (
    <>
      <BrandHeader title={doc.title} createdAt={doc.created_at} shareUrl={shareUrl} />
      <iframe
        srcDoc={doc.content}
        sandbox="allow-scripts"
        className="doc-iframe"
        title={doc.title || "Document"}
      />
    </>
  );
}
