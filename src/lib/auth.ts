import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function getSecret(): string {
  const s = process.env.ECHO_COOKIE_SECRET;
  if (!s) throw new Error("ECHO_COOKIE_SECRET not set");
  return s;
}

export function signSlugToken(slug: string): string {
  const ts = Date.now().toString();
  const sig = createHmac("sha256", getSecret()).update(`unlock:${slug}:${ts}`).digest("hex");
  return `${ts}.${sig}`;
}

export function verifySlugToken(slug: string, token: string): boolean {
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return false;
  const tsNum = Number.parseInt(ts, 10);
  if (Number.isNaN(tsNum)) return false;
  const ageMs = Date.now() - tsNum;
  if (ageMs < 0 || ageMs > TOKEN_TTL_MS) return false;
  const expected = createHmac("sha256", getSecret()).update(`unlock:${slug}:${ts}`).digest("hex");
  if (expected.length !== sig.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
