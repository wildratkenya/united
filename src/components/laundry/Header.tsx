import React, { useState } from 'react';
import { Menu, X, Phone, Search } from 'lucide-react';

interface HeaderProps {
  onTrackClick: () => void;
  onBookClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onTrackClick, onBookClick }) => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Our Branches', href: '#branches' },
    { label: 'Contact Us', href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="United Dry Cleaners"
              className="h-12 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#008cd5] to-[#2f5aae] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                  <path d="M5 3h14l-1 4H6L5 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="14" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            <div>
              <div className="font-bold text-[#1a2332] text-lg leading-tight">United</div>
              <div className="text-xs text-slate-500 leading-tight">Dry Cleaners Ltd</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-slate-700 hover:text-[#EE6633] transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+254729112066" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#1a2332]">
              <Phone className="w-4 h-4" />
              +254 729 112 066
            </a>
            <button
              onClick={onTrackClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#1a2332] text-[#1a2332] font-semibold text-sm hover:bg-[#1a2332] hover:text-white transition"
            >
              <Search className="w-4 h-4" /> Track
            </button>
            <button
              onClick={onBookClick}
              className="px-5 py-2.5 rounded-full bg-[#EE6633] text-white font-semibold text-sm hover:bg-[#d45520] shadow-lg shadow-[#EE6633]/30 transition"
            >
              Book Pickup
            </button>
          </div>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 space-y-2">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
              >
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 px-4 pt-2">
              <button onClick={onTrackClick} className="flex-1 px-4 py-2.5 rounded-full border-2 border-[#1a2332] text-[#1a2332] font-semibold text-sm">Track</button>
              <button onClick={onBookClick} className="flex-1 px-4 py-2.5 rounded-full bg-[#EE6633] text-white font-semibold text-sm">Book</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
