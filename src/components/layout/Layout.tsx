import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer, useToast } from '@/components/Toast';
import React from 'react';

export const ToastContext = React.createContext<{
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}>({ addToast: () => {} });

export function useToastContext() {
  return React.useContext(ToastContext);
}

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const { toasts, addToast, removeToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="min-h-screen bg-hti-bg text-white flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        {showFooter && <Footer />}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}
