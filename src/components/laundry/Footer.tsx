import React, { useState } from 'react';
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.jpeg" alt="United Dry Cleaners" className="h-10 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div>
                <div className="text-white font-bold text-lg">United</div>
                <div className="text-xs text-slate-400">Dry Cleaners Ltd</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-5">
              Kenya's most trusted premium laundry & dry cleaning service since 1965. 
              Where care meets precision in every service.
            </p>
            <div className="flex gap-3">
              <a href="https://web.facebook.com/profile.php?id=61580740872738" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#008cd5] flex items-center justify-center transition">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="https://www.instagram.com/uniteddrycleaners/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#008cd5] flex items-center justify-center transition">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="https://wa.me/254733810400" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#008cd5] flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/watch?v=0ud5YwljIy4" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#008cd5] flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@united_drycleaners" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#008cd5] flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Services</h4>
            <ul className="space-y-3 text-sm">
              {['Dry Cleaning', 'Laundry Services', 'Steam Pressing', 'Wash, Dry & Fold', 'Wedding & Graduation Gowns', 'Leather Jacket Cleaning', 'Duvets & Beddings'].map((s) => (
                <li key={s}><a href="#services" className="hover:text-[#EE6633] transition">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Our Branches</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#branches" className="hover:text-[#EE6633] transition">Munyu Road (UDC): 7:00am-6:00pm</a></li>
              <li><a href="#branches" className="hover:text-[#EE6633] transition">Ruiru (UDC): 7:30am-6:30pm</a></li>
              <li><a href="#branches" className="hover:text-[#EE6633] transition">Malindi (UDC): 7:30am-5:30pm</a></li>
              <li><a href="#branches" className="hover:text-[#EE6633] transition">Nairobi West (YUDC): 7:00-6:30pm</a></li>
              <li><a href="#branches" className="hover:text-[#EE6633] transition">Kenyatta Market (YUDC): 7:00am-6:30pm</a></li>
              <li><a href="#branches" className="hover:text-[#EE6633] transition">Thika (YUDC): 8:00am-6:00pm</a></li>
              <li><a href="#branches" className="hover:text-[#EE6633] transition">Uthiru (YUDC): 7:00am-7:00pm</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#EE6633] flex-shrink-0" />
                <span>United Dry Cleaners Mansion,<br />Munyu Road/Sheikh Karume Junction</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#EE6633]" />
                <a href="tel:+254729112066" className="hover:text-white transition">+254 729 112 066</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#EE6633]" />
                <a href="tel:+254733810400" className="hover:text-white transition">+254 733 810 400</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#EE6633]" />
                <a href="mailto:info@uniteddrycleaners.co.ke" className="hover:text-white transition">info@uniteddrycleaners.co.ke</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-[#EE6633] flex-shrink-0" />
                <span>Mon-Sat: 7:00am - 6:00pm<br />Sat closes 5:00pm<br />Sun &amp; Holidays: Closed</span>
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
