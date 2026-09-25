'use client';

import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/ProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import QuoteForm from '@/components/QuoteForm';
import Marquee, { type MarqueeItem } from '@/components/Marquee';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/lib/i18n';

type Category = { _id: string; name: string; slug: string; description?: string; productCount?: number };

export default function HomeContent({
  categories,
  featured,
  showcase,
}: {
  categories: Category[];
  featured: any[];
  showcase: MarqueeItem[];
}) {
  const { t } = useLanguage();

  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section
  className="relative flex min-h-[520px] items-center overflow-hidden
  border-b border-ink/10 text-paper lg:min-h-[620px]"
>
  <Image
    src="/storefront.jpg"
    alt="EMCO LDA storefront"
    fill
    sizes="100vw"
    priority
    unoptimized
    className="object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/85 to-brandDeep/90" />
  <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />

  <div className="wrap relative py-16 lg:py-24">
    <div className="max-w-xl animate-fade-up">
      <h1 className="font-narrow text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
        {t('hero_title')}
      </h1>

      <p className="mt-5 max-w-lg text-base leading-relaxed text-mist">
        {t('hero_sub')}
      </p>

      <p className="mt-3 max-w-lg text-sm font-medium text-brand">
        {t('hero_tagline')}
      </p>

      <form action="/products" className="mt-8 flex max-w-lg gap-2">
        <input
          name="q"
          type="search"
          placeholder={t('hero_search')}
          aria-label="Search"
          className="w-full rounded-sm border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-paper placeholder:text-mist backdrop-blur-sm transition-colors focus:border-brand focus:outline-none"
        />

        <button className="btn-signal shrink-0">
          {t('hero_search_btn')}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/contact" className="btn-signal">
          {t('hero_cta_quote')}
        </Link>

        <Link
          href="/products"
          className="btn border border-white/25 text-paper hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
        >
          {t('hero_cta_explore')}
        </Link>
      </div>

      <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
        {[
          [t('stat_1_v'), t('stat_1_l')],
          [t('stat_2_v'), t('stat_2_l')],
          [t('stat_3_v'), t('stat_3_l')],
        ].map(([value, label]) => (
          <div key={label as string}>
            <dt className="font-narrow text-2xl font-bold text-brand">
              {value}
            </dt>

            <dd className="mt-0.5 text-sm text-mist">
              {label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
</section>

        {/* Infinite scrolling marquee of stock photos */}
        <Marquee items={showcase} />

        {/* Categories */}
        <section className="wrap py-16">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="font-narrow text-3xl font-bold">{t('dept_title')}</h2>
            <Link href="/products" className="text-sm font-semibold text-steel transition-colors hover:text-brand">
              {t('dept_more')}
            </Link>
          </Reveal>

          {categories.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-8 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c, i) => (
                <Reveal key={c._id} delay={i * 60}>
                  <Link
                    href={`/products?category=${c.slug}`}
                    className="group block h-full bg-white p-6 transition-colors hover:bg-concrete"
                  >
                    <h3 className="font-narrow text-xl font-bold transition-colors group-hover:text-brandDark">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel">{c.description}</p>
                    <p className="mt-4 text-sm font-semibold text-brandDark">
                      {c.productCount} {t('dept_items')}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="wrap pb-16">
            <Reveal>
              <h2 className="font-narrow text-3xl font-bold">{t('featured_title')}</h2>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p: any, i: number) => (
                <Reveal key={p._id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Trust */}
        <section className="bg-concrete">
          <div className="wrap grid gap-10 py-16 sm:grid-cols-3">
            {[
              [t('trust_1_t'), t('trust_1_b')],
              [t('trust_2_t'), t('trust_2_b')],
              [t('trust_3_t'), t('trust_3_b')],
            ].map(([title, body], i) => (
              <Reveal key={title as string} delay={i * 100}>
                <h3 className="font-narrow text-xl font-bold">{title as string}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-steel">{body as string}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="wrap py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <h2 className="font-narrow text-3xl font-bold">{t('quote_title')}</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel">{t('quote_sub')}</p>
            </Reveal>
            <Reveal delay={120} className="card-lift border border-ink/10 bg-white p-6 sm:p-8">
              <QuoteForm />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 border border-dashed border-ink/25 bg-white p-10 text-center">
      <p className="font-narrow text-xl font-bold">The catalogue is empty</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-steel">
        Run <code className="rounded-sm bg-concrete px-1.5 py-0.5">npm run seed</code> to load the
        sample departments and products, or add your first product from the admin dashboard.
      </p>
      <Link href="/admin" className="btn-primary mt-5">Open the dashboard</Link>
    </div>
  );
}
