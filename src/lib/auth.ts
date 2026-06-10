/**
 * Minimal shared-password gate for /admin.
 *
 * The session cookie stores a SHA-256 digest of the admin password (never the
 * password itself). Both the login route (Node runtime) and the proxy
 * (edge runtime) derive the same digest via Web Crypto, so the proxy can
 * validate the cookie without a database round-trip.
 */

export const ADMIN_COOKIE = "sleek_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The cookie value we expect for the configured password. */
export async function expectedSessionToken(): Promise<string | null> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256Hex(`${pw}::sleektech-admin::v1`);
}

/** True when the supplied password matches ADMIN_PASSWORD. */
export function passwordMatches(candidate: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && candidate === pw;
}

/** Validate a cookie value against the expected token. */
export async function isValidSession(
  cookieValue: string | undefined,
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await expectedSessionToken();
  return Boolean(expected) && cookieValue === expected;
}
