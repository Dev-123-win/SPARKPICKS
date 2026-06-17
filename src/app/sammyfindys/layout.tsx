import type { Metadata } from 'next';
import AdminPasswordGate from '@/components/admin/AdminPasswordGate';

export const metadata: Metadata = {
  title: 'Admin Console — SparkPicks',
  description: 'Manage SparkPicks product curations',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', width: '100%' }}>
      <AdminPasswordGate>
        {children}
      </AdminPasswordGate>
    </div>
  );
}
