import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="wrap flex min-h-[50vh] flex-col justify-center py-20">
        <p className="font-narrow text-6xl font-bold text-signal">404</p>
        <h1 className="mt-3 font-narrow text-3xl font-bold">That page is not here</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-steel">
          The item may have been renamed or removed from the catalogue. Search for it instead.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/products" className="btn-primary">Browse the catalogue</Link>
          <Link href="/contact" className="btn-ghost">Ask the sales desk</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
