-- ============================================
-- echo — Database Schema
-- Version: 0.1.0
-- Last Updated: 2026-05-23
-- Description: v0 schema — single documents table, no users yet
-- ============================================

-- ============================================
-- documents — published HTML/MD shares
-- ============================================
CREATE TABLE documents (
  slug TEXT PRIMARY KEY,
  format TEXT NOT NULL CHECK (format IN ('html', 'md')),
  content TEXT NOT NULL,
  password_hash TEXT,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

COMMENT ON TABLE documents IS 'Published HTML/MD documents shared via short URL';
COMMENT ON COLUMN documents.slug IS '8-character nanoid, used as the share URL path';
COMMENT ON COLUMN documents.format IS 'md = Markdown (server-rendered), html = HTML (sandboxed iframe)';
COMMENT ON COLUMN documents.content IS 'Full document source, max 2 MB';
COMMENT ON COLUMN documents.password_hash IS 'bcrypt hash if password-protected, NULL if public';
COMMENT ON COLUMN documents.title IS 'Optional display title shown on password gate and navbar';

-- ============================================
-- Row Level Security
-- ============================================
-- v0: all access goes through the service role key from the server.
-- Disable RLS to keep things simple; tighten when accounts ship in v1.
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
