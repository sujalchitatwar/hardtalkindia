import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Send, Mail, Facebook, MessageCircle } from 'lucide-react';
import { getSiteSettings } from '@/lib/dataService';
import type { SiteSettings } from '@/types/database';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/stories', label: 'Stories' },
  { to: '/videos', label: 'Video Hub' },
  { to: '/submit-story', label: 'Submit Story' },
  { to: '/newsletter', label: 'Newsletter' },
  { to: '/donate', label: 'Support Us' },
];

const categories = [
  'Women Safety',
  'Crime',
  'Politics',
  'Ground Reports',
  'Fake News Debunked',
  'Survivor Stories',
];

export default function Footer() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data) setSettings(data);
    }).catch(() => {});
  }, []);

  const socialLinks = [
    { icon: Instagram, href: settings.social_instagram || 'https://instagram.com/HardTalkIndia', label: 'Instagram' },
    { icon: Twitter, href: settings.social_twitter || 'https://x.com/hardtalkindiaa', label: 'Twitter/X' },
    { icon: Youtube, href: settings.social_youtube || 'https://www.youtube.com/@HardTalkIndiaa', label: 'YouTube' },
    { icon: Facebook, href: settings.social_facebook || 'https://facebook.com/HardTalkIndia', label: 'Facebook' },
    { icon: Send, href: settings.social_telegram || 'https://t.me/HardTalkIndia', label: 'Telegram' },
    { icon: MessageCircle, href: settings.social_whatsapp || 'https://wa.me/HardTalkIndia', label: 'WhatsApp' },
  ];

  return (
    <footer className="border-t border-hti-border bg-hti-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/assets/logo.png" alt="HardTalkIndia" className="h-10 w-10 rounded-md" />
              <span className="text-xl font-bold">
                <span className="text-hti-orange">H</span>
                <span className="text-white">ard</span>
                <span className="text-hti-orange">T</span>
                <span className="text-white">alk</span>
                <span className="text-hti-green">I</span>
                <span className="text-white">ndia</span>
              </span>
            </Link>
            <p className="text-sm text-hti-gray leading-relaxed mb-4">
              The Voice of Unfiltered India. Ground Reality | No Filters | No Lies.
            </p>
            <p className="text-xs text-hti-gray/60 font-mono">
              No Filters &bull; No Lies &bull; Only Ground Reality
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-hti-gray hover:text-hti-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/stories?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-hti-gray hover:text-hti-primary transition-colors duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-hti-card border border-hti-border flex items-center justify-center text-hti-gray hover:text-hti-primary hover:border-hti-primary/50 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <a
              href="mailto:contact@hardtalkindia.com"
              className="inline-flex items-center gap-2 text-sm text-hti-gray hover:text-hti-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@hardtalkindia.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-hti-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-hti-gray/50">
            &copy; {new Date().getFullYear()} HardTalkIndia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="text-xs text-hti-gray/50 hover:text-hti-primary transition-colors">
              Contact
            </Link>
            <Link to="/about" className="text-xs text-hti-gray/50 hover:text-hti-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="text-xs text-hti-gray/50 hover:text-hti-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
