import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';

/** Every helper degrades to empty data if the database is unreachable,
 *  so the site still renders instead of throwing a 500. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDB();
    return await fn();
  } catch (err) {
    console.error('[db]', err);
    return fallback;
  }
}

export function getCategories() {
  return safe(async () => {
    const cats = await Category.find().sort({ name: 1 }).lean();
    const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const map = new Map(counts.map((c: any) => [String(c._id), c.count as number]));
    return cats.map((c: any) => ({
      _id: String(c._id),
      name: c.name as string,
      slug: c.slug as string,
      description: (c.description as string) || '',
      image: (c.image as string) || '',
      productCount: map.get(String(c._id)) ?? 0,
    }));
  }, [] as any[]);
}

export function getFeaturedProducts(limit = 8) {
  return safe(async () => {
    const items = await Product.find({ featured: true })
      .populate('category', 'name slug')
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(items));
  }, [] as any[]);
}

export function getProducts(opts: { q?: string; category?: string; page?: number; limit?: number }) {
  const { q, category, page = 1, limit = 12 } = opts;
  return safe(
    async () => {
      const filter: Record<string, unknown> = {};
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { brand: { $regex: q, $options: 'i' } },
          { sku: { $regex: q, $options: 'i' } },
          { summary: { $regex: q, $options: 'i' } },
        ];
      }
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
      return {
        items: JSON.parse(JSON.stringify(items)),
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
      };
    },
    { items: [] as any[], total: 0, page: 1, pages: 1 }
  );
}

export function getProductBySlug(slug: string) {
  return safe(async () => {
    const item = await Product.findOne({ slug }).populate('category', 'name slug').lean();
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }, null as any);
}

export function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return safe(async () => {
    const items = await Product.find({ category: categoryId, _id: { $ne: excludeId } })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(items));
  }, [] as any[]);
}

/** Images for the homepage marquee — pulled from real product photos so it
 *  always reflects actual stock once the admin has uploaded some. */
export function getShowcaseImages(limit = 16) {
  return safe(async () => {
    const items = await Product.find({ images: { $exists: true, $ne: [] } })
      .select('name images')
      .limit(limit)
      .lean();
    return items.flatMap((p: any) =>
      (p.images || []).slice(0, 1).map((src: string) => ({ src, alt: p.name as string }))
    );
  }, [] as { src: string; alt: string }[]);
}

export function getAllProductSlugs() {
  return safe(async () => {
    const items = await Product.find().select('slug updatedAt').lean();
    return items.map((i: any) => ({ slug: i.slug as string, updatedAt: i.updatedAt as Date }));
  }, [] as { slug: string; updatedAt: Date }[]);
}
