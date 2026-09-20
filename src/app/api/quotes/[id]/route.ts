import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { status } = await req.json();
  await connectDB();
  const quote = await Quote.findByIdAndUpdate(params.id, { status }, { new: true });
  if (!quote) return Response.json({ error: 'Request not found.' }, { status: 404 });
  return Response.json(quote);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await connectDB();
  await Quote.findByIdAndDelete(params.id);
  return Response.json({ ok: true });
}
