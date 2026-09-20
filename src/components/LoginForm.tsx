'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error || 'Sign in failed.');
      setBusy(false);
      return;
    }
    router.push(params.get('next') || '/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm bg-paper p-8">
      <h1 className="font-narrow text-2xl font-bold">Staff sign in</h1>
      <p className="mt-1.5 text-sm text-steel">Manage the catalogue and quote requests.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="field" autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="field" autoComplete="current-password" />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <button className="btn-primary mt-6 w-full" disabled={busy}>
        {busy ? 'Signing in' : 'Sign in'}
      </button>
    </form>
  );
}
