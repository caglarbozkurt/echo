/**
 * Supabase Client (server-side only)
 * Uses service role key — credentials never exposed to browser.
 */

import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing env.SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Database row types
 */

export interface DocumentRow {
  slug: string;
  format: "html" | "md" | "pdf";
  content: string;
  password_hash: string | null;
  title: string | null;
  indexable: boolean;
  created_at: string;
}
