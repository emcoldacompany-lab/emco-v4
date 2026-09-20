'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cx } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const phone = process.env.NEXT_PUBLIC_PHONE || '+258 87 200 5200';

  const nav = [
    { href: '/', label: t('nav_home') },
    { href: '/products', label: t('nav_products') },
    { href: '/about', label: t('nav_about') },
    { href: '/contact', label: t('nav_contact') },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Image src="/logo-icon.png" alt="EMCO LDA" width={38} height={38} className="rounded-full" priority />
          <span className="font-narrow text-xl font-bold tracking-tight">EMCO LDA</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                'relative text-sm font-medium transition-colors hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-300 hover:after:w-full',
                isActive(item.href) ? 'text-ink after:w-full' : 'text-steel'
              )}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="btn-signal">
            {phone}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-sm border border-ink/20 transition-colors hover:border-ink/50"
          >
            <span className="text-lg">{open ? '×' : '≡'}</span>
          </button>
        </div>
      </div>

      <div
        className={cx(
          'overflow-hidden border-t border-ink/10 bg-paper transition-[max-height] duration-300 ease-out md:hidden',
          open ? 'max-h-64' : 'max-h-0 border-t-0'
        )}
      >
        <div className="wrap flex flex-col py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-steel transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="btn-signal mt-2">
            {phone}
          </a>
        </div>
      </div>
    </header>
  );
}
