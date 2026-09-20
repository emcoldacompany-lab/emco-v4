import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/ProductCard';
import CatalogueControls from '@/components/CatalogueControls';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getCategories, getProducts } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catalogue',
  description:
    'Browse building materials, power tools, plumbing and electrical hardware in stock in Maputo.',
};

type Search = { q?: string; category?: string; page?: string };

export default async function ProductsPage({ searchParams }: { searchParams: Search }) {
  const page = Math.max(1, Number(searchParams.page || 1));
  const [categories, data] = await Promise.all([
    getCategories(),
    getProducts({ q: searchParams.q, category: searchParams.category, page, limit: 12 }),
  ]);

  const qs = (p: number) => {
    const sp = new URLSearchParams();
    if (searchParams.q) sp.set('q', searchParams.q);
    if (searchParams.category) sp.set('category', searchParams.category);
    sp.set('page', String(p));
    return `/products?${sp.toString()}`;
  };

  return (
    <>
      <SiteHeader />

      <main className="wrap py-12">
        <h1 className="font-narrow text-4xl font-bold">Catalogue</h1>
        <p className="mt-2 text-sm text-steel">
          {data.total} {data.total === 1 ? 'item' : 'items'}
          {searchParams.q ? ` matching “${searchParams.q}”` : ''}
        </p>

        <div className="mt-8">
          <Suspense fallback={null}>
            <CatalogueControls categories={categories} />
          </Suspense>
        </div>

        {data.items.length === 0 ? (
          <div className="mt-12 border border-dashed border-ink/25 bg-white p-12 text-center">
            <p className="font-narrow text-xl font-bold">Nothing matched that search</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-steel">
              Try a shorter word, or send us the item directly — we stock more than we list.
            </p>
            <Link href="/contact" className="btn-primary mt-5">
              Ask the sales desk
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {data.pages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            {page > 1 && (
              <Link href={qs(page - 1)} className="btn-ghost">
                Previous
              </Link>
            )}
            <span className="px-4 text-sm text-steel">
              Page {page} of {data.pages}
            </span>
            {page < data.pages && (
              <Link href={qs(page + 1)} className="btn-ghost">
                Next
              </Link>
            )}
          </nav>
        )}
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
