'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cx } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/quotes', label: 'Quote requests' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === '/admin/login') return null;

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="border-b border-ink/10 bg-ink text-paper">
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <div className="flex items-center gap-7">
          <Link href="/" className="font-narrow text-lg font-bold">
            EMCO LDA
          </Link>
          <nav className="flex gap-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  'text-sm transition-colors hover:text-signal',
                  pathname === l.href ? 'text-signal' : 'text-mist'
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <button onClick={signOut} className="text-sm text-mist hover:text-signal">
          Sign out
        </button>
      </div>
    </header>
  );
}
