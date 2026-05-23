-- 2026-05-23 — Add `indexable` flag to documents
-- Default false: docs stay noindex unless the publisher opts in.

ALTER TABLE documents ADD COLUMN indexable BOOLEAN NOT NULL DEFAULT false;
COMMENT ON COLUMN documents.indexable IS 'If true, search engines can index this doc. Default false (noindex).';
