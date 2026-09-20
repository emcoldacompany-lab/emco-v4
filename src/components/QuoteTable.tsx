'use client';

import { useState } from 'react';

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;

export default function QuoteTable({ quotes }: { quotes: any[] }) {
  const [rows, setRows] = useState(quotes);

  async function setStatus(id: string, status: string) {
    setRows((r) => r.map((q) => (q._id === id ? { ...q, status } : q)));
    await fetch(`/api/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  if (rows.length === 0) {
    return (
      <p className="border border-dashed border-ink/25 bg-white p-10 text-center text-sm text-steel">
        No requests yet. Every form submission on the site lands here.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((q) => (
        <article key={q._id} className="border border-ink/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-narrow text-lg font-bold">{q.name}</p>
              <p className="text-sm text-steel">
                {q.company ? `${q.company} · ` : ''}
                <a href={`tel:${q.phone}`} className="hover:text-ink">{q.phone}</a>
                {q.email ? ` · ${q.email}` : ''}
              </p>
            </div>
            <select
              value={q.status}
              onChange={(e) => setStatus(q._id, e.target.value)}
              className="rounded-sm border border-ink/20 bg-white px-3 py-2 text-sm"
              aria-label={`Status for ${q.name}`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {q.productName && (
            <p className="mt-3 text-sm">
              <span className="text-steel">Asking about:</span> {q.productName}
              {q.quantity ? ` — ${q.quantity}` : ''}
            </p>
          )}
          {q.message && <p className="mt-2 text-sm leading-relaxed text-steel">{q.message}</p>}

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href={`https://wa.me/${String(q.phone).replace(/\D/g, '').replace(/^0/, '256')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-signalDark"
            >
              Reply on WhatsApp
            </a>
            <span className="text-mist">
              {new Date(q.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
