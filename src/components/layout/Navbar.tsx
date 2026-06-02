import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mic } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/stories', label: 'Stories' },
  { to: '/videos', label: 'Videos' },
  { to: '/about', label: 'About' },
  { to: '/submit-story', label: 'Submit Story' },
  { to: '/donate', label: 'Donate' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/logo.png"
              alt="HardTalkIndia"
              className="h-9 w-9 rounded-md object-cover"
            />
            <span className="hidden sm:block text-lg font-bold tracking-tight">
              <span className="text-hti-orange">H</span>
              <span className="text-white">ard</span>
              <span className="text-hti-orange">T</span>
              <span className="text-white">alk</span>
              <span className="text-hti-green">I</span>
              <span className="text-white">ndia</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-hti-primary bg-hti-primary/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/newsletter"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-hti-primary/10 text-hti-primary rounded-lg text-sm font-medium hover:bg-hti-primary/20 transition-all border border-hti-primary/30"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden md:inline">Subscribe</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass border-t border-white/5 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.to)
                  ? 'text-hti-primary bg-hti-primary/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/newsletter"
            className="sm:hidden block px-4 py-2.5 text-sm font-medium text-hti-primary"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </nav>
  );
}
