import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/ProductCard';
import QuoteForm from '@/components/QuoteForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { formatMZN } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product not found' };
  return {
    title: product.name,
    description: product.summary || product.description?.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.summary,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(
    product.category?._id ?? product.category,
    product._id,
    4
  );

  // Rich results in Google — the thing templated competitors almost never do.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary || product.description,
    sku: product.sku || undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    image: product.images,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MZN',
      price: product.price ?? undefined,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="wrap py-10">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-steel">
          <Link href="/products" className="hover:text-ink">Catalogue</Link>
          <span aria-hidden>/</span>
          {product.category?.slug && (
            <>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-ink">
                {product.category.name}
              </Link>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-concrete">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-mist">No image yet</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((src: string) => (
                  <div key={src} className="relative aspect-square bg-concrete">
                    <Image src={src} alt="" fill sizes="20vw" className="object-cover" unoptimized  />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.brand && <p className="text-sm font-medium text-mist">{product.brand}</p>}
            <h1 className="mt-1 font-narrow text-4xl font-bold leading-tight">{product.name}</h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="font-narrow text-3xl font-bold">{formatMZN(product.price)}</span>
              {product.price != null && (
                <span className="text-sm text-steel">per {product.unit || 'piece'}</span>
              )}
              <span
                className={`rounded-sm px-2.5 py-1 text-xs font-semibold ${
                  product.inStock ? 'bg-signal text-ink' : 'bg-ink text-paper'
                }`}
              >
                {product.inStock ? 'In stock in Maputo' : 'Out of stock — ask for ETA'}
              </span>
            </div>

            {product.description && (
              <p className="mt-6 text-sm leading-relaxed text-steel">{product.description}</p>
            )}

            {product.specs?.length > 0 && (
              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {product.specs.map((s: any) => (
                  <div key={s.label} className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-steel">{s.label}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 border border-ink/10 bg-white p-6">
              <h2 className="font-narrow text-xl font-bold">Ask for a price</h2>
              <p className="mt-1.5 text-sm text-steel">
                Bulk pricing drops below the listed rate. Tell us the quantity.
              </p>
              <div className="mt-5">
                <QuoteForm productId={product._id} productName={product.name} compact />
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-narrow text-2xl font-bold">Also in {product.category?.name}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
      <WhatsAppButton message={`Hello EMCO LDA, I want a price for ${product.name}.`} />
    </>
  );
}
