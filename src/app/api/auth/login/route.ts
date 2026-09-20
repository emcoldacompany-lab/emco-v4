import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { createSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return Response.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email: String(email).toLowerCase() });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return Response.json({ error: 'That email and password do not match.' }, { status: 401 });
  }

  const token = await createSession({
    sub: String(user._id),
    email: user.email,
    name: user.name,
  });

  const res = Response.json({ ok: true, name: user.name });
  res.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
  return res;
}
