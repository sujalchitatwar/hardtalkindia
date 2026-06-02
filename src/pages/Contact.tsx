import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Instagram, Twitter, Youtube, Send, Globe } from 'lucide-react';
import Layout, { useToastContext } from '@/components/layout/Layout';

export default function Contact() {
  const { addToast } = useToastContext();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending - in production, connect to Supabase or email service
    setTimeout(() => {
      addToast('Message sent! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  return (
    <Layout>
      <section className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <MessageSquare className="w-12 h-12 text-hti-primary mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Contact Us</h1>
            <p className="text-hti-gray max-w-lg mx-auto">
              Have a tip, feedback, or want to collaborate? We would love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card-glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-hti-gray mb-2">Name *</label>
                    <input
                      type="text" value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-hti-gray mb-2">Email *</label>
                    <input
                      type="email" value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-2">Subject *</label>
                  <input
                    type="text" value={formData.subject}
                    onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                    required
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-hti-gray mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    required
                    rows={5}
                    placeholder="Your message..."
                    className="w-full px-4 py-3 rounded-lg bg-hti-bg border border-hti-border text-white placeholder:text-hti-gray/40 focus:outline-none focus:border-hti-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  className="w-full btn-primary py-3.5 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  <a href="mailto:contact@hardtalkindia.com" className="flex items-center gap-3 text-hti-gray hover:text-hti-primary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-hti-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-hti-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Email</p>
                      <p className="text-xs">contact@hardtalkindia.com</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 text-hti-gray">
                    <div className="w-10 h-10 rounded-lg bg-hti-green/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-hti-green" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Website</p>
                      <p className="text-xs">hardtalkindia.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Social Media</h3>
                <div className="space-y-3">
                  {[
                    { icon: Instagram, href: 'https://instagram.com/HardTalkIndia', label: '@HardTalkIndia', color: 'text-pink-500' },
                    { icon: Twitter, href: 'https://x.com/hardtalkindiaa', label: '@hardtalkindiaa', color: 'text-blue-400' },
                    { icon: Youtube, href: 'https://www.youtube.com/@HardTalkIndiaa', label: '@HardTalkIndiaa', color: 'text-red-500' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-hti-gray hover:text-white transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-hti-bg border border-hti-border flex items-center justify-center group-hover:border-hti-primary/50">
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <span className="text-sm">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/submit-story"
                    className="block w-full text-center py-3 rounded-lg bg-hti-primary/10 border border-hti-primary/30 text-hti-primary text-sm font-medium hover:bg-hti-primary/20 transition-colors"
                  >
                    Submit a Story
                  </Link>
                  <Link
                    to="/newsletter"
                    className="block w-full text-center py-3 rounded-lg bg-hti-green/10 border border-hti-green/30 text-hti-green text-sm font-medium hover:bg-hti-green/20 transition-colors"
                  >
                    Subscribe to Newsletter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
