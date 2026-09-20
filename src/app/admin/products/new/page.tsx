import ProductForm from '@/components/ProductForm';
import { getCategories } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function NewProduct() {
  const categories = await getCategories();
  return (
    <>
      <h1 className="font-narrow text-3xl font-bold">Add a product</h1>
      <p className="mt-1.5 text-sm text-steel">It appears in the catalogue as soon as you publish.</p>
      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </>
  );
}
