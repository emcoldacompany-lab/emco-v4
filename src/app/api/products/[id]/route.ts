import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const product = await Product.findById(params.id).populate('category', 'name slug').lean();
  if (!product) return Response.json({ error: 'Product not found.' }, { status: 404 });
  return Response.json(product);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  await connectDB();
  const product = await Product.findByIdAndUpdate(
    params.id,
    { ...body, price: body.price === '' || body.price == null ? null : Number(body.price) },
    { new: true }
  );
  if (!product) return Response.json({ error: 'Product not found.' }, { status: 404 });
  return Response.json(product);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return Response.json({ ok: true });
}
