import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocBySlug } from "@/lib/db";
import { CopyButton } from "@/components/CopyButton";
import { Footer } from "@/components/Footer";
import { getBaseUrl } from "@/lib/baseUrl";
import { formatLabel } from "@/lib/formats";

export const dynamic = "force-dynamic";

export default async function PublishedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();

  const url = `${getBaseUrl()}/d/${slug}`;

  return (
    <>
      <main className="container">
        <h1 className="brand">echo</h1>
        <p className="tagline">✓ Published.</p>

        <div className="published-card">
          <div className="published-url">{url}</div>
          <div className="published-actions">
            <CopyButton text={url} />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="open-btn"
            >
              Open ↗
            </a>
          </div>
        </div>

        <dl className="meta-list">
          {doc.title && (
            <>
              <dt>Title</dt>
              <dd>{doc.title}</dd>
            </>
          )}
          <dt>Format</dt>
          <dd>{formatLabel(doc.format)}</dd>
          <dt>Password</dt>
          <dd>{doc.password_hash ? "Yes" : "No"}</dd>
        </dl>

        <Link href="/" className="link-primary">
          Publish another →
        </Link>
      </main>
      <Footer />
    </>
  );
}
