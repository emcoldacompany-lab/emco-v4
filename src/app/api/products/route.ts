import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();
  const category = searchParams.get('category');
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(48, Number(searchParams.get('limit') || 12));

  const filter: Record<string, unknown> = {};
  if (q) filter.$or = [
    { name: { $regex: q, $options: 'i' } },
    { brand: { $regex: q, $options: 'i' } },
    { sku: { $regex: q, $options: 'i' } },
    { summary: { $regex: q, $options: 'i' } },
  ];
  if (category) {
    const cat = await Category.findOne({ slug: category }).select('_id').lean<{ _id: unknown }>();
    filter.category = cat?._id ?? null;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return Response.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  if (!body.name || !body.category) {
    return Response.json({ error: 'Product name and category are required.' }, { status: 400 });
  }

  await connectDB();
  const slug = body.slug || slugify(body.name);
  const exists = await Product.findOne({ slug });
  const product = await Product.create({
    ...body,
    price: body.price === '' || body.price == null ? null : Number(body.price),
    slug: exists ? `${slug}-${Date.now().toString().slice(-4)}` : slug,
  });
  return Response.json(product, { status: 201 });
}
