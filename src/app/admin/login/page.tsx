import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5">
      <Suspense fallback={<div className="text-sm text-mist">Loading the sign-in form…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
