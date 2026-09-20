import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');
export const SESSION_COOKIE = 'tm_session';

export type SessionPayload = { sub: string; email: string; name: string };

export async function createSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySession(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Read the session inside a server component or route handler. */
export async function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** Use at the top of any admin API route. Returns null when authorised. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Sign in to continue.' }, { status: 401 });
  }
  return null;
}
