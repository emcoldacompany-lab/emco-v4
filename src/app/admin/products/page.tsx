import Link from 'next/link';
import { getProducts } from '@/lib/queries';
import { formatMZN } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = Math.max(1, Number(searchParams.page || 1));
  const data = await getProducts({ q: searchParams.q, page, limit: 25 });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-narrow text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-steel">{data.total} in the catalogue</p>
        </div>
        <Link href="/admin/products/new" className="btn-signal">Add a product</Link>
      </div>

      <form action="/admin/products" className="mt-6 flex max-w-md gap-2">
        <input name="q" defaultValue={searchParams.q} placeholder="Find a product" className="field" />
        <button className="btn-ghost shrink-0">Find</button>
      </form>

      {data.items.length === 0 ? (
        <p className="mt-10 border border-dashed border-ink/25 bg-white p-10 text-center text-sm text-steel">
          Nothing here yet. Add your first product, or run <code>npm run seed</code> for sample data.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-ink/10 text-left text-steel">
              <tr>
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Department</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {data.items.map((p: any) => (
                <tr key={p._id}>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-steel">{p.category?.name || '—'}</td>
                  <td className="p-3">{formatMZN(p.price)}</td>
                  <td className="p-3">{p.inStock ? 'In stock' : 'Out'}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${p._id}`} className="font-semibold hover:text-signalDark">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.pages > 1 && (
        <nav className="mt-8 flex items-center gap-3">
          {page > 1 && <Link href={`/admin/products?page=${page - 1}`} className="btn-ghost">Previous</Link>}
          <span className="text-sm text-steel">Page {page} of {data.pages}</span>
          {page < data.pages && <Link href={`/admin/products?page=${page + 1}`} className="btn-ghost">Next</Link>}
        </nav>
      )}
    </>
  );
}
