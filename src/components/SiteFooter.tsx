'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';

export default function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const email = process.env.NEXT_PUBLIC_EMAIL || 'emcoldacompany@gmail.com';
  const phone = process.env.NEXT_PUBLIC_PHONE || '+258 87 200 5200';

  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.png" alt="EMCO LDA" width={36} height={36} className="rounded-full" />
            <p className="font-narrow text-xl font-bold">EMCO LDA</p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">{t('footer_desc')}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">{t('footer_shop')}</p>
          <ul className="space-y-2 text-sm text-mist">
            <li><Link href="/products" className="transition-colors hover:text-brand">{t('footer_all')}</Link></li>
            <li><Link href="/products?category=power-tools" className="transition-colors hover:text-brand">{t('footer_power')}</Link></li>
            <li><Link href="/products?category=building-materials" className="transition-colors hover:text-brand">{t('footer_materials')}</Link></li>
            <li><Link href="/products?category=plumbing" className="transition-colors hover:text-brand">{t('footer_plumbing')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">{t('footer_company')}</p>
          <ul className="space-y-2 text-sm text-mist">
            <li><Link href="/about" className="transition-colors hover:text-brand">{t('nav_about')}</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-brand">{t('nav_contact')}</Link></li>
            <li><Link href="/admin" className="transition-colors hover:text-brand">{t('nav_staff')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">{t('footer_reach')}</p>
          <ul className="space-y-2 text-sm text-mist">
            <li><a href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:text-brand">{phone}</a></li>
            <li><a href={`mailto:${email}`} className="transition-colors hover:text-brand">{email}</a></li>
            <li>Nampula, Mozambique</li>
            <li>{t('hours_weekday')}</li>
            <li>{t('hours_saturday')}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap py-5 text-xs text-mist">
          <p>© {year} EMCO LDA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
