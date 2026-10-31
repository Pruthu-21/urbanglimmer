import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Urban Glimmer — Enterprise Control Panel & Administration',
  description: 'Manage catalogue, orders, inventory, coupons, and campaigns.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
