import { connectDB } from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const map = new Map(counts.map((c: any) => [String(c._id), c.count]));
  return Response.json(
    categories.map((c: any) => ({ ...c, productCount: map.get(String(c._id)) ?? 0 }))
  );
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  if (!body.name) return Response.json({ error: 'Category name is required.' }, { status: 400 });

  await connectDB();
  const category = await Category.create({ ...body, slug: body.slug || slugify(body.name) });
  return Response.json(category, { status: 201 });
}
