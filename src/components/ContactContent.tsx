'use client';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import QuoteForm from '@/components/QuoteForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/lib/i18n';

export default function ContactContent() {
  const { t } = useLanguage();
  const phone = process.env.NEXT_PUBLIC_PHONE || '+258 87 200 5200';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'emcoldacompany@gmail.com';

  return (
    <>
      <SiteHeader />
      <main className="wrap py-14">
        <Reveal>
          <h1 className="font-narrow text-4xl font-bold">{t('contact_title')}</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-steel">{t('contact_sub')}</p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal delay={80} className="card-lift border border-ink/10 bg-white p-6 sm:p-8">
            <QuoteForm />
          </Reveal>

          <Reveal delay={140} className="space-y-6">
            <div>
              <h2 className="font-narrow text-xl font-bold">{t('contact_phone')}</h2>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="mt-1 block text-sm text-steel transition-colors hover:text-brand">
                {phone}
              </a>
            </div>
            <div>
              <h2 className="font-narrow text-xl font-bold">{t('contact_email')}</h2>
              <a href={`mailto:${email}`} className="mt-1 block text-sm text-steel transition-colors hover:text-brand">
                {email}
              </a>
            </div>
            <div>
              <h2 className="font-narrow text-xl font-bold">{t('contact_counter')}</h2>
              <p className="mt-1 text-sm leading-relaxed text-steel">
                Nampula, Mozambique
                <br />
                {t('hours_weekday')}
                <br />
                {t('hours_saturday')}
              </p>
            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
