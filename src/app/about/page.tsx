import type { Metadata } from 'next';
import AboutContent from '@/components/AboutContent';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Who EMCO LDA is, our mission and values, and how we supply Mozambique.',
};

export default function AboutPage() {
  return <AboutContent />;
}
