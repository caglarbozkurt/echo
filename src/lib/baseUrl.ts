/**
 * Read NEXT_PUBLIC_BASE_URL and strip any trailing slashes.
 * Use this everywhere the base URL is concatenated with a path —
 * keeps results clean regardless of how the env var is set in Vercel.
 */

export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
