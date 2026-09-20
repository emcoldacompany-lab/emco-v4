'use client';

import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import WhatsAppButton from '@/components/WhatsAppButton';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <SiteHeader />

      <main>
        <section className="border-b border-ink/10 bg-gradient-to-br from-ink to-brandDeep text-paper">
          <div className="wrap py-16">
            <Reveal>
              <h1 className="max-w-3xl font-narrow text-4xl font-bold leading-tight sm:text-5xl">
                {t('about_hero')}
              </h1>
            </Reveal>
          </div>
        </section>

        <div className="wrap py-14">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              {[
                ['about_us_title', 'about_us_body'],
                ['purpose_title', 'purpose_body'],
                ['mission_title', 'mission_body'],
                ['vision_title', 'vision_body'],
              ].map(([titleKey, bodyKey], i) => (
                <Reveal key={titleKey} delay={i * 80}>
                  <h2 className="font-narrow text-2xl font-bold text-brandDark">{t(titleKey as any)}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel">{t(bodyKey as any)}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200} className="hover-zoom relative hidden aspect-square overflow-hidden rounded-sm border border-ink/10 bg-concrete lg:block">
              <Image
                src="/about-1.jpg"
                alt="EMCO LDA hardware and supply"
                fill
                sizes="(max-width: 1024px) 0px, 30vw"
                className="object-cover"
              />
            </Reveal>
          </div>

          <div className="my-14 h-1 w-full bg-gradient-to-r from-brand to-brandDeep" />

          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-narrow text-2xl font-bold">{t('goals_title')}</h2>
              <ul className="mt-4 space-y-2.5">
                {(t('goals') as unknown as string[]).map((g) => (
                  <li key={g} className="flex gap-2.5 text-sm leading-relaxed text-steel">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {g}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="grid gap-10 sm:grid-cols-2">
              <Reveal delay={80}>
                <h2 className="font-narrow text-2xl font-bold">{t('values_title')}</h2>
                <ul className="mt-4 space-y-2 text-sm text-steel">
                  {(t('values') as unknown as string[]).map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={140}>
                <h2 className="font-narrow text-2xl font-bold">{t('products_title')}</h2>
                <ul className="mt-4 space-y-2 text-sm text-steel">
                  {(t('products_list') as unknown as string[]).map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>

        <section className="bg-concrete py-16">
          <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="font-narrow text-3xl font-bold">{t('partner_title')}</h2>
              <p className="mt-4 text-sm leading-relaxed text-steel">{t('partner_body_1')}</p>
              <p className="mt-3 text-sm leading-relaxed text-steel">{t('partner_body_2')}</p>
            </Reveal>
            <Reveal delay={100} className="hover-zoom relative aspect-video overflow-hidden rounded-sm">
              <Image
                src="/about-2.jpg"
                alt="Construction site in Mozambique"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-gradient-to-r from-brandDeep via-ink to-brandDeep py-16 text-center text-paper">
          <Reveal>
            <p className="font-narrow text-2xl font-bold sm:text-3xl">{t('banner_tagline')}</p>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
