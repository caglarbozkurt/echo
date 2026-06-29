-- 2026-05-25 — Allow `pdf` as a document format
-- PDF bytes are stored base64-encoded in the existing content TEXT column.
-- This is a v0 hack — moves to Supabase Storage when sizes get larger.

ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_format_check;
ALTER TABLE documents ADD CONSTRAINT documents_format_check CHECK (format IN ('html', 'md', 'pdf'));
