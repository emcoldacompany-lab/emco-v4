'use client';

import { useState } from 'react';

type Props = { productId?: string; productName?: string; compact?: boolean };

export default function QuoteForm({ productId, productName, compact }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, product: productId, productName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-ink/15 bg-white p-6">
        <p className="font-narrow text-xl font-bold">Request received</p>
        <p className="mt-2 text-sm leading-relaxed text-steel">
          Our sales desk replies within one working day, usually much sooner. Keep your phone close.
        </p>
        <button onClick={() => setStatus('idle')} className="btn-ghost mt-4">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {productName && (
        <p className="text-sm text-steel">
          Requesting a price for <span className="font-semibold text-ink">{productName}</span>
        </p>
      )}

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div>
          <label className="label" htmlFor="name">Your name</label>
          <input id="name" name="name" required className="field" placeholder="Musa Kigozi" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone or WhatsApp</label>
          <input id="phone" name="phone" required className="field" placeholder="0700 000 000" />
        </div>
        <div>
          <label className="label" htmlFor="company">Company (optional)</label>
          <input id="company" name="company" className="field" placeholder="Kigozi Contractors" />
        </div>
        <div>
          <label className="label" htmlFor="quantity">Quantity needed</label>
          <input id="quantity" name="quantity" className="field" placeholder="20 bags" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="message">What do you need?</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="field resize-y"
          placeholder="List the items, sizes and delivery location."
        />
      </div>

      {status === 'error' && <p className="text-sm text-red-700">{error}</p>}

      <button type="submit" className="btn-signal w-full sm:w-auto" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending' : 'Request a quote'}
      </button>
    </form>
  );
}
