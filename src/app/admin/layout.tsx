import AdminNav from '@/components/AdminNav';

export const metadata = { title: 'Dashboard', robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <AdminNav />
      <main className="wrap py-10">{children}</main>
    </div>
  );
}
