'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { cx } from '@/lib/utils';

type Cat = { _id: string; name: string; slug: string; productCount?: number };

export default function CatalogueControls({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [pending, start] = useTransition();
  const active = params.get('category') ?? '';

  function push(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    sp.delete('page');
    start(() => router.push(`/products?${sp.toString()}`));
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: q || null });
        }}
        className="flex gap-2"
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by product, brand or item code"
          className="field"
          aria-label="Search the catalogue"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={pending}>
          {pending ? 'Searching' : 'Search'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => push({ category: null })}
          className={cx(
            'rounded-sm border px-3 py-1.5 text-sm transition-colors',
            !active ? 'border-ink bg-ink text-paper' : 'border-ink/20 text-steel hover:border-ink'
          )}
        >
          Everything
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => push({ category: c.slug })}
            className={cx(
              'rounded-sm border px-3 py-1.5 text-sm transition-colors',
              active === c.slug
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/20 text-steel hover:border-ink'
            )}
          >
            {c.name}
            {typeof c.productCount === 'number' && (
              <span className="ml-1.5 text-xs opacity-60">{c.productCount}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
