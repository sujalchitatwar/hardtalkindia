import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { ToastContainer } from '@/components/Toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      if (data.session) {
        addToast('Login successful!', 'success');
        setTimeout(() => navigate('/admin/dashboard'), 500);
      }
    } catch (err: any) {
      addToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hti-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/assets/logo.png" alt="HardTalkIndia" className="h-12 w-12 rounded-lg" />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            <span className="text-hti-orange">H</span>
            <span className="text-white">ard</span>
            <span className="text-hti-orange">T</span>
            <span className="text-white">alk</span>
            <span className="text-hti-green">I</span>
            <span className="text-white">ndia</span>
          </h1>
          <p className="text-hti-gray text-sm">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="card-glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-hti-primary" />
            <h2 className="text-lg font-semibold">Secure Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-hti-gray mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hti-gray" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hardtalkindia.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-hti-gray mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hti-gray" />
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hti-gray hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : <><Shield className="w-4 h-4" /> Login</>}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-hti-border text-center">
            <a href="/" className="text-sm text-hti-gray hover:text-hti-primary transition-colors">
              Back to website
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-hti-gray/40 mt-6">
          Protected by Supabase Auth. Unauthorized access is prohibited.
        </p>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
