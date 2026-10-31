'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Megaphone,
  MessageSquare,
  Image,
  BarChart3,
  Settings,
  Shield,
  FileText,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { getAdminSession, setAdminSession, AdminUser, INITIAL_ADMINS } from '@/lib/customerStore';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Collections', href: '/admin/collections', icon: Layers },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Media Library', href: '/admin/media', icon: Image },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  { label: 'Staff & Roles', href: '/admin/users', icon: Shield },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Authentication barrier state
  const [loginEmail, setLoginEmail] = useState('aarav@urbanglimmer.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    setMounted(true);
    const active = getAdminSession();
    setSession(active);

    const handleAuthChange = () => {
      setSession(getAdminSession());
    };
    window.addEventListener('ug_admin_auth_changed', handleAuthChange);
    return () => window.removeEventListener('ug_admin_auth_changed', handleAuthChange);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = INITIAL_ADMINS.find((a) => a.email.toLowerCase() === loginEmail.toLowerCase());
    if (admin) {
      setAdminSession(admin);
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    setAdminSession(null);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#211C1D] text-white flex items-center justify-center">Loading Admin Suite...</div>;
  }

  // If not authenticated, show secure staff login screen
  if (!session) {
    return (
      <div className="min-h-screen bg-[#151313] text-[#F8F4EE] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#211C1D] p-8 rounded border border-[#C6A064]/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#603A46] text-[#C6A064] flex items-center justify-center border border-[#C6A064]/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl text-white font-medium">Urban Glimmer Staff Portal</h1>
            <p className="text-xs text-[#766D6D]">Authorized administrative access only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#C6A064] block mb-1">
                Admin Staff Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#151313] border border-white/20 rounded px-3 py-2 text-white focus:outline-[#C6A064]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#C6A064] block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#151313] border border-white/20 rounded px-3 py-2 text-white focus:outline-[#C6A064]"
              />
            </div>

            {loginError && (
              <div className="text-red-400 text-xs">{loginError}</div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#603A46] hover:bg-[#852F3A] text-white font-bold uppercase tracking-wider rounded transition-colors"
            >
              Authenticate & Enter
            </button>

            <div className="pt-2 text-center">
              <Link href="/" className="text-[11px] text-[#766D6D] hover:text-white">
                ← Return to Public Storefront
              </Link>
            </div>
          </form>

          {/* Quick Staff Demo Switcher */}
          <div className="pt-4 border-t border-white/10 text-xs text-[#766D6D] space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold block">Quick Demo Staff Accounts:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {INITIAL_ADMINS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setLoginEmail(a.email);
                    setAdminSession(a);
                  }}
                  className="p-1.5 bg-[#151313] border border-white/10 rounded hover:border-[#C6A064] text-left truncate text-white"
                >
                  <strong className="block truncate">{a.name}</strong>
                  <span className="text-[9px] text-[#C6A064]">{a.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#211B1C] flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-[#211C1D] text-[#F8F4EE] border-b border-[#C6A064]/20 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden p-1 text-[#F8F4EE] hover:text-[#C6A064]"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-tight text-white font-medium">
              URBAN GLIMMER
            </span>
            <span className="hidden sm:inline-block text-[9px] bg-[#603A46] text-[#C6A064] font-bold px-2 py-0.5 rounded border border-[#C6A064]/40 uppercase tracking-wider">
              Control Panel
            </span>
          </Link>
        </div>

        {/* Staff Profile and Storefront Link */}
        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-[#C6A064] hover:text-white transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#603A46] text-[#C6A064] font-serif font-bold flex items-center justify-center border border-[#C6A064]/40">
              {session.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-semibold block text-white text-[11px] leading-tight">
                {session.name}
              </span>
              <span className="text-[9px] text-[#C6A064] uppercase font-mono">
                {session.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-[#766D6D] hover:text-red-400 transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#151313] text-[#F8F4EE] border-r border-[#C6A064]/20 flex flex-col justify-between transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-widest text-[#766D6D]">
              Management Modules
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-[#603A46] text-white shadow-xs'
                      : 'text-[#E8DFD5]/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C6A064]' : 'text-[#766D6D]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 text-[10px] text-[#766D6D] space-y-1">
            <p className="text-white font-medium">Urban Glimmer v2.4 Enterprise</p>
            <p>Database: Operational · Cache: Synchronized</p>
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
