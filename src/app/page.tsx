import HomeContent from '@/components/HomeContent';
import { getCategories, getFeaturedProducts, getShowcaseImages } from '@/lib/queries';
import { showcase as placeholderShowcase } from '@/lib/showcase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, featured, realShowcase] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getShowcaseImages(16),
  ]);
  // Once real products carry photos, the marquee shows those. Until then it
  // falls back to neutral placeholder tiles rather than showing nothing.
  const showcase = realShowcase.length >= 6 ? realShowcase : placeholderShowcase;
  return <HomeContent categories={categories} featured={featured} showcase={showcase} />;
}
