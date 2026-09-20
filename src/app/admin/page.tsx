import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { Quote } from '@/models/Quote';
import { Category } from '@/models/Category';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function stats() {
  try {
    await connectDB();
    const [products, categories, newQuotes, totalQuotes, recent] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Quote.countDocuments({ status: 'new' }),
      Quote.countDocuments(),
      Quote.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);
    return {
      products,
      categories,
      newQuotes,
      totalQuotes,
      recent: JSON.parse(JSON.stringify(recent)) as any[],
    };
  } catch {
    return { products: 0, categories: 0, newQuotes: 0, totalQuotes: 0, recent: [] as any[] };
  }
}

export default async function AdminHome() {
  const [session, s] = await Promise.all([getSession(), stats()]);

  return (
    <>
      <h1 className="font-narrow text-3xl font-bold">Hello {session?.name?.split(' ')[0]}</h1>
      <p className="mt-1.5 text-sm text-steel">Here is where the business stands today.</p>

      <div className="mt-8 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-4">
        {[
          ['New requests', s.newQuotes, '/admin/quotes'],
          ['All requests', s.totalQuotes, '/admin/quotes'],
          ['Products live', s.products, '/admin/products'],
          ['Departments', s.categories, '/admin/products'],
        ].map(([label, value, href]) => (
          <Link key={label as string} href={href as string} className="bg-white p-5 hover:bg-concrete">
            <p className="text-sm text-steel">{label as string}</p>
            <p className="mt-1 font-narrow text-3xl font-bold">{value as number}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn-signal">Add a product</Link>
        <Link href="/admin/quotes" className="btn-ghost">Open the request list</Link>
      </div>

      <section className="mt-12">
        <h2 className="font-narrow text-xl font-bold">Latest requests</h2>
        {s.recent.length === 0 ? (
          <p className="mt-3 text-sm text-steel">
            No requests yet. They land here the moment a visitor submits the form.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-white">
            {s.recent.map((q) => (
              <li key={q._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{q.name}</p>
                  <p className="text-sm text-steel">
                    {q.phone}
                    {q.productName ? ` · ${q.productName}` : ''}
                  </p>
                </div>
                <span className="rounded-sm bg-concrete px-2.5 py-1 text-xs font-semibold">
                  {q.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
