import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Send, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/lib/supabase';

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
      await supabase.from('subscribers').upsert(
        { email, source: 'newsletter', is_active: true },
        { onConflict: 'email' }
      );

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
        <div className="bg-gradient-to-r from-[#008cd5] to-[#2f5aae] rounded-3xl p-8 sm:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#008cd5] to-[#2f5aae] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                  <path d="M5 3h14l-1 4H6L5 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="14" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-white text-base leading-tight">United</div>
                <div className="text-[10px] text-slate-400 leading-tight">Dry Cleaners Ltd</div>
              </div>
            </div>
            <p className="text-xs mb-3 leading-relaxed">Serving Nairobi since 1965.</p>
            <div className="flex gap-2">
              <a href="https://www.facebook.com/UnitedDryCleanersLtd" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition"><Facebook className="w-3.5 h-3.5" /></a>
              <a href="https://www.instagram.com/uniteddrycleanersltd/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E4405F] flex items-center justify-center transition"><Instagram className="w-3.5 h-3.5" /></a>
              <a href="https://wa.me/254729112066" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/whatsapp.png" className="w-3.5 h-3.5" alt="WhatsApp" /></a>
              <a href="https://www.youtube.com/@uniteddrycleaners" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF0000] flex items-center justify-center transition"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/youtube-play.png" className="w-3.5 h-3.5" alt="YouTube" /></a>
              <a href="https://www.tiktok.com/@uniteddrycleanersltd" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok.png" className="w-3.5 h-3.5" alt="TikTok" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/about" className="hover:text-[#EE6633] transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-[#EE6633] transition">Services</Link></li>
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Branches</Link></li>
              <li><Link to="/pricing" className="hover:text-[#EE6633] transition">Pricing</Link></li>
              <li><Link to="/track" className="hover:text-[#EE6633] transition">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-[#EE6633] transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Services</h4>
            <ul className="space-y-1.5 text-sm">
              {['Dry Cleaning', 'Laundry Services', 'Steam Pressing', 'Wash, Dry & Fold', 'Wedding & Graduation Gowns', 'Leather Jacket Cleaning', 'Duvets & Beddings'].map((s) => (
                <li key={s}><Link to="/services" className="hover:text-[#EE6633] transition">{s}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Our Branches</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Munyu Road (UDC)</Link></li>
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Ruiru (UDC)</Link></li>
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Malindi (UDC)</Link></li>
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Nairobi West (YUDC)</Link></li>
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Kenyatta Market (YUDC)</Link></li>
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Thika (YUDC)</Link></li>
              <li><Link to="/branches" className="hover:text-[#EE6633] transition">Uthiru (YUDC)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#EE6633] shrink-0" />
                <span className="text-xs">United Dry Cleaners Mansion, Munyu Road</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#EE6633] shrink-0" />
                <a href="tel:+254729112066" className="text-xs hover:text-white transition">+254 729 112 066</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#EE6633] shrink-0" />
                <a href="tel:+254733810400" className="text-xs hover:text-white transition">+254 733 810 400</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#EE6633] shrink-0" />
                <a href="mailto:info@uniteddrycleaners.co.ke" className="text-xs hover:text-white transition">info@uniteddrycleaners.co.ke</a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 mt-0.5 text-[#EE6633] shrink-0" />
                <span className="text-xs">Mon-Fri 7am-6pm, Sat 7am-5pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 United Dry Cleaners Ltd. All rights reserved.</p>
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
