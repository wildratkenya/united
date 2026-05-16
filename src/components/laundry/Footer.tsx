import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Send, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await fetch('https://famous.ai/api/crm/6a0857b2724ad9ad4fbb89d9/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer-signup', tags: ['newsletter', 'laundry'] }),
      });
      toast.success('Welcome! You\'re subscribed.');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <footer id="contact" className="bg-[#0f1828] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter */}
        <div className="bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] rounded-3xl p-8 sm:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">Get 20% off your first order</h3>
            <p className="opacity-90">Subscribe for exclusive deals, pickup reminders, and care tips.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full md:w-auto bg-white rounded-full p-1.5 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-2.5 outline-none text-slate-900 rounded-full text-sm"
            />
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#1a2332] text-white font-semibold rounded-full hover:bg-black transition flex items-center gap-2 text-sm disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                  <path d="M5 3h14l-1 4H6L5 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="14" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-lg">United</div>
                <div className="text-xs text-slate-400">Dry Cleaners</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-5">
              Nairobi's most trusted premium laundry & dry cleaning service since 2010.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#ff6b6b] flex items-center justify-center transition">
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Services</h4>
            <ul className="space-y-3 text-sm">
              {['Dry Cleaning', 'Wash & Fold', 'Ironing & Pressing', 'Wedding Dress Care', 'Leather & Suede', 'Curtains & Drapes'].map((s) => (
                <li key={s}><a href="#services" className="hover:text-[#ff6b6b] transition">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Us', href: '#' },
                { label: 'How It Works', href: '#how' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Track Order', href: '#track' },
                { label: 'FAQs', href: '#' },
                { label: 'Careers', href: '#' },
              ].map((l) => (
                <li key={l.label}><a href={l.href} className="hover:text-[#ff6b6b] transition">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#ff6b6b] flex-shrink-0" />
                <span>Westlands Square,<br />Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#ff6b6b]" />
                <a href="tel:+254700000000" className="hover:text-white transition">+254 700 000 000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#ff6b6b]" />
                <a href="mailto:hello@uniteddrycleaners.co.ke" className="hover:text-white transition">hello@uniteddrycleaners.co.ke</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-[#ff6b6b] flex-shrink-0" />
                <span>Mon-Sat: 7AM - 8PM<br />Sun: 9AM - 5PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 United Dry Cleaners. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
