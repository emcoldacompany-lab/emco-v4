import { Resend } from 'resend';
import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Public: a visitor asks for a price. */
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.phone) {
    return Response.json({ error: 'Add your name and phone number so we can reply.' }, { status: 400 });
  }

  await connectDB();
  const quote = await Quote.create({
    name: body.name,
    company: body.company || '',
    phone: body.phone,
    email: body.email || '',
    quantity: body.quantity || '',
    message: body.message || '',
    product: body.product || null,
    productName: body.productName || '',
  });

  // Email the sales desk — fire-and-forget, so a slow/failed email never
  // blocks the visitor's confirmation or loses the quote itself.
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails
      .send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.RESEND_TO_EMAIL || 'emcoldacompany@gmail.com',
        subject: `New quote request — ${quote.name}`,
        text: [
          `Name: ${quote.name}`,
          `Company: ${quote.company || '—'}`,
          `Phone: ${quote.phone}`,
          `Email: ${quote.email || '—'}`,
          `Product: ${quote.productName || '—'}`,
          `Quantity: ${quote.quantity || '—'}`,
          `Message: ${quote.message || '—'}`,
        ].join('\n'),
      })
      .catch((err) => console.error('[resend]', err));
  }

  return Response.json({ ok: true, id: quote._id }, { status: 201 });
}

/** Admin: list incoming requests. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  await connectDB();
  const quotes = await Quote.find().sort({ createdAt: -1 }).limit(200).lean();
  return Response.json(quotes);
}