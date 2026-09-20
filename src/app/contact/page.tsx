import type { Metadata } from 'next';
import ContactContent from '@/components/ContactContent';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Call, WhatsApp or send your list. Quotes come back the same working day.',
};

export default function ContactPage() {
  return <ContactContent />;
}
