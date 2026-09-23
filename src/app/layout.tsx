import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EMCO LDA — construction, electrical and hardware supply in Mozambique',
    template: '%s · EMCO LDA',
  },
  description:
    'EMCO LDA supplies construction materials, electrical equipment, agricultural tools and hardware across Mozambique. Send a product list, get a priced quote the same day.',
  openGraph: {
    type: 'website',
    siteName: 'EMCO LDA',
    url: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Archivo+Narrow:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
