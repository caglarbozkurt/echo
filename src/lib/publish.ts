/**
 * Shared publish pipeline used by the web form (server action) and the
 * REST endpoint (POST /api/publish). Generates a slug, hashes the
 * password if provided, and writes the row.
 */

import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { insertDoc } from "@/lib/db";
import type { DocFormat } from "@/lib/formats";

export const MAX_CONTENT_BYTES = 2 * 1024 * 1024;
export const SLUG_LENGTH = 8;
const BCRYPT_COST = 10;

export type CreateDocInput = {
  content: string;
  format: DocFormat;
  password?: string | null;
  title?: string | null;
  indexable?: boolean;
};

export async function createDocument(input: CreateDocInput): Promise<string> {
  const slug = nanoid(SLUG_LENGTH);
  const passwordHash = input.password
    ? await bcrypt.hash(input.password, BCRYPT_COST)
    : null;

  await insertDoc({
    slug,
    format: input.format,
    content: input.content,
    password_hash: passwordHash,
    title: input.title ?? null,
    indexable: input.indexable ?? false,
  });

  return slug;
}
