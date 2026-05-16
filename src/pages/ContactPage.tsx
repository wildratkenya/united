import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#0f1828] to-[#1a2332] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-slate-300 text-lg">We're here to help — call, WhatsApp, or visit any branch</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-[#1a2332]">Get in touch</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#008cd5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a2332]">Head Office</h3>
                    <p className="text-sm text-slate-500">United Dry Cleaners Mansion,<br />Munyu Road / Sheikh Karume Junction, Nairobi</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#008cd5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a2332]">Phone</h3>
                    <a href="tel:+254729112066" className="text-sm text-[#008cd5] hover:text-[#EE6633] transition block">+254 729 112 066</a>
                    <a href="tel:+254733810400" className="text-sm text-[#008cd5] hover:text-[#EE6633] transition block">+254 733 810 400</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#008cd5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a2332]">Email</h3>
                    <a href="mailto:info@uniteddrycleaners.co.ke" className="text-sm text-[#008cd5] hover:text-[#EE6633] transition">info@uniteddrycleaners.co.ke</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#008cd5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a2332]">Operating Hours</h3>
                    <p className="text-sm text-slate-500">
                      Mon - Fri: 7:00 AM - 6:00 PM<br />
                      Saturday: 7:00 AM - 5:00 PM<br />
                      Sunday & Holidays: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-[#1a2332] mb-3">Follow us</h3>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/UnitedDryCleanersLtd" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition"><Facebook className="w-4 h-4" /></a>
                  <a href="https://www.instagram.com/uniteddrycleanersltd/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition"><Instagram className="w-4 h-4" /></a>
                  <a href="https://wa.me/254729112066" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition"><MessageCircle className="w-4 h-4" /></a>
                  <a href="https://www.youtube.com/@uniteddrycleaners" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF0000] hover:text-white flex items-center justify-center transition">
                    <img src="https://img.icons8.com/ios-filled/50/000000/youtube-play.png" className="w-4 h-4" alt="YouTube" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-[#1a2332] mb-2">Send us a message</h2>
              <p className="text-sm text-slate-500 mb-6">Or reach us on <a href="https://wa.me/254729112066" target="_blank" rel="noopener noreferrer" className="text-[#008cd5] font-semibold hover:text-[#EE6633]">WhatsApp</a> for a faster response.</p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008cd5]/30 focus:border-[#008cd5] text-sm" />
                  <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008cd5]/30 focus:border-[#008cd5] text-sm" />
                </div>
                <input type="tel" placeholder="Phone number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008cd5]/30 focus:border-[#008cd5] text-sm" />
                <textarea placeholder="Your message" rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008cd5]/30 focus:border-[#008cd5] text-sm resize-none" />
                <button type="submit" className="w-full py-3 rounded-xl bg-[#EE6633] text-white font-semibold hover:bg-[#d45520] transition">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
