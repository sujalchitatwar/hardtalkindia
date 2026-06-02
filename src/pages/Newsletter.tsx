import { useState } from 'react';
import { Mail, Check, Shield, Zap, Bell } from 'lucide-react';
import Layout, { useToastContext } from '@/components/layout/Layout';
import { subscribeNewsletter } from '@/lib/dataService';

const benefits = [
  { icon: Zap, title: 'Weekly Digest', desc: 'Get the top stories of the week delivered every Sunday' },
  { icon: Bell, title: 'Breaking Alerts', desc: 'Be the first to know when breaking news happens' },
  { icon: Shield, title: 'No Spam Ever', desc: 'We respect your inbox. Unsubscribe anytime with one click' },
];

export default function Newsletter() {
  const { addToast } = useToastContext();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      await subscribeNewsletter(email, name || undefined);
      addToast('Successfully subscribed!', 'success');
      setSubscribed(true);
      setEmail('');
      setName('');
    } catch (err: any) {
      addToast(err.message || 'Subscription failed', 'error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Mail className="w-12 h-12 text-hti-green mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Join 10,000+ Truth Seekers</h1>
            <p className="text-hti-gray max-w-lg mx-auto">
              Subscribe to HardTalkIndia's newsletter for unfiltered ground reports,
              investigations, and citizen journalism delivered to your inbox.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {benefits.map((b) => (
              <div key={b.title} className="card-glass rounded-xl p-5 text-center">
                <b.icon className="w-6 h-6 text-hti-primary mx-auto mb-3" />
                <h3 className="font-medium text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-hti-gray">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Subscribe Form */}
          <div className="card-glass rounded-2xl p-6 sm:p-8">
            {subscribed ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-hti-green/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-hti-green" />
                </div>
                <h2 className="text-xl font-bold mb-2">You are subscribed!</h2>
                <p className="text-hti-gray text-sm">
                  Welcome to the HardTalkIndia community. Check your inbox for a confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-hti-gray mb-2">Email Address *</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" required
                    className="w-full px-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-2">Name (optional)</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-green transition-colors"
                  />
                </div>
                <button
                  type="submit" disabled={subscribing}
                  className="w-full btn-primary py-3.5 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {subscribing ? 'Subscribing...' : <><Mail className="w-5 h-5" /> Subscribe</>}
                </button>
                <p className="text-xs text-hti-gray/60 text-center">
                  By subscribing, you agree to receive emails from HardTalkIndia.
                  Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
