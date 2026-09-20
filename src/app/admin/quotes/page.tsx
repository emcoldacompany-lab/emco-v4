import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import QuoteTable from '@/components/QuoteTable';

export const dynamic = 'force-dynamic';

async function getQuotes() {
  try {
    await connectDB();
    const quotes = await Quote.find().sort({ createdAt: -1 }).limit(200).lean();
    return JSON.parse(JSON.stringify(quotes)) as any[];
  } catch {
    return [];
  }
}

export default async function AdminQuotes() {
  const quotes = await getQuotes();
  return (
    <>
      <h1 className="font-narrow text-3xl font-bold">Quote requests</h1>
      <p className="mt-1.5 text-sm text-steel">
        {quotes.length} received. Move each one along as you work it.
      </p>
      <div className="mt-8">
        <QuoteTable quotes={quotes} />
      </div>
    </>
  );
}
