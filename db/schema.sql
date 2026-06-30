-- ============================================
-- echo — Database Schema
-- Version: 0.1.0
-- Last Updated: 2026-06-29
-- Description: Single documents table.
-- ============================================

-- ============================================
-- documents — published HTML/MD/PDF shares
-- ============================================
CREATE TABLE documents (
  slug TEXT PRIMARY KEY,
  format TEXT NOT NULL CHECK (format IN ('html', 'md', 'pdf')),
  content TEXT NOT NULL,
  password_hash TEXT,
  title TEXT,
  indexable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

COMMENT ON TABLE documents IS 'Published HTML/MD/PDF documents shared via short URL';
COMMENT ON COLUMN documents.slug IS '8-character nanoid, used as the share URL path';
COMMENT ON COLUMN documents.format IS 'md = Markdown (server-rendered), html = HTML (sandboxed iframe), pdf = PDF (content is base64-encoded bytes)';
COMMENT ON COLUMN documents.content IS 'Full document source, max 2 MB';
COMMENT ON COLUMN documents.password_hash IS 'bcrypt hash if password-protected, NULL if public';
COMMENT ON COLUMN documents.title IS 'Optional display title shown on password gate and navbar';
COMMENT ON COLUMN documents.indexable IS 'If true, search engines can index this doc. Default false (noindex).';

-- ============================================
-- Row Level Security
-- ============================================
-- All access flows through the service role key from the server, so RLS
-- is intentionally disabled. Re-enable and add policies if you introduce
-- per-user access (anon/authenticated reads, multi-tenant ownership, etc.).
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
