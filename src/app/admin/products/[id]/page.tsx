import { notFound } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { getCategories } from '@/lib/queries';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  try {
    await connectDB();
    const p = await Product.findById(id).lean();
    return p ? JSON.parse(JSON.stringify(p)) : null;
  } catch {
    return null;
  }
}

export default async function EditProduct({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([getProduct(params.id), getCategories()]);
  if (!product) notFound();

  return (
    <>
      <h1 className="font-narrow text-3xl font-bold">{product.name}</h1>
      <p className="mt-1.5 text-sm text-steel">Editing a live catalogue item.</p>
      <div className="mt-8">
        <ProductForm categories={categories} product={product} />
      </div>
    </>
  );
}
