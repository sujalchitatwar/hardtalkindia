import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Inbox, Video, Users,
  BarChart3, Settings, LogOut, Shield, Menu, X, ChevronLeft
} from 'lucide-react';
import { getSession, signOut, onAuthStateChange } from '@/lib/supabase';
import { ToastContainer, useToast } from '@/components/Toast';
import React from 'react';

export const AdminToastContext = React.createContext<{
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}>({ addToast: () => {} });

export function useAdminToast() {
  return React.useContext(AdminToastContext);
}

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/stories', icon: FileText, label: 'Stories' },
  { to: '/admin/submissions', icon: Inbox, label: 'Submissions' },
  { to: '/admin/reels', icon: Video, label: 'Reels' },
  { to: '/admin/subscribers', icon: Users, label: 'Subscribers' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = onAuthStateChange((session) => {
      setAuthenticated(!!session);
      if (!session) navigate('/admin/login');
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAuth() {
    const session = await getSession();
    setAuthenticated(!!session);
    if (!session) navigate('/admin/login');
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-hti-bg flex items-center justify-center">
        <div className="animate-pulse text-hti-primary text-lg font-medium">Checking authentication...</div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <AdminToastContext.Provider value={{ addToast }}>
      <div className="min-h-screen bg-hti-bg text-white flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-hti-card border-r border-hti-border flex flex-col transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Admin Header */}
          <div className="p-4 border-b border-hti-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-hti-primary" />
              <span className="font-bold text-sm">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-hti-primary/10 text-hti-primary font-medium'
                      : 'text-hti-gray hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-hti-border space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-hti-gray hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-hti-gray hover:text-hti-breaking hover:bg-hti-breaking/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden glass sticky top-0 z-30 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm">HardTalkIndia Admin</span>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </AdminToastContext.Provider>
  );
}
