import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle, Phone } from 'lucide-react';

const faqs = [
  {
    q: 'What areas do you cover for pickup and delivery?',
    a: 'We cover all of Nairobi (Westlands, Kilimani, Karen, Lavington, Runda, Parklands, CBD, Kileleshwa, Hurlingham, Langata) plus Kiambu, Ruiru, Thika, and Malindi. Free pickup on orders above KSh 1,500. You can also drop off at any of our 7 branches or 14 agent locations.',
  },
  {
    q: 'How long does dry cleaning take?',
    a: 'Standard turnaround is 24-48 hours for most items. Express same-day service is available for drop-offs before 11 AM at select branches. Specialty items like wedding dresses and leather jackets may take 3-5 days.',
  },
  {
    q: 'How does the order tracking work?',
    a: 'Once your order is collected or dropped off, you receive an SMS with a unique order ID. Enter it on our tracking page to see real-time updates — from received → processing → washing → drying → pressing → packaging → ready → delivered.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept M-Pesa, cash on delivery, and credit/debit cards. Payment is collected on delivery for pickup orders, or at drop-off for branch customers. Corporate accounts can arrange monthly billing.',
  },
  {
    q: 'What is your satisfaction guarantee?',
    a: 'We offer a 100% satisfaction guarantee. If you are not happy with the cleaning, we will re-clean the item free of charge, no questions asked. If the issue persists, we will refund the cleaning cost for that item.',
  },
  {
    q: 'Do you offer commercial or bulk cleaning?',
    a: 'Yes. We provide bulk laundry services for hotels, restaurants, salons, and corporate offices. Contact our commercial team at +254 733 810 400 for custom pricing and scheduled bulk pickups.',
  },
  {
    q: 'What are your operating hours?',
    a: 'All branches are open Monday to Friday 8:00 AM - 6:00 PM and Saturday 8:00 AM - 5:00 PM. We are closed on Sundays and public holidays. Online booking is available 24/7.',
  },
  {
    q: 'How do I become an agent?',
    a: 'We partner with businesses across Nairobi to serve as UDC collection points. If you are interested in becoming an agent, call us at +254 729 112 066 or visit our Munyu Road head office.',
  },
];

const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-blue-50 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#008cd5] text-sm font-semibold mb-5 border border-blue-100">
            <HelpCircle className="w-4 h-4" /> FAQ
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1a2332] mb-4">
            Got questions?{' '}
            <span className="text-[#EE6633]">We've got answers</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Everything you need to know about our service.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                open === i
                  ? 'border-[#008cd5]/30 bg-blue-50/30 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/50 transition"
              >
                <span className="font-semibold text-[#1a2332] pr-4 text-sm sm:text-base">
                  {f.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  open === i ? 'bg-[#008cd5] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-slate-600 leading-relaxed text-sm">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-[#008cd5] to-[#005a8c] rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5" />
            <span className="font-bold text-lg">Still have questions?</span>
          </div>
          <p className="text-white/80 mb-5 text-sm">
            Call us or send a WhatsApp message — we're happy to help.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="tel:+254729112066"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-full text-sm font-semibold transition"
            >
              <Phone className="w-4 h-4" /> +254 729 112 066
            </a>
            <a
              href="https://wa.me/254729112066"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-full text-sm font-semibold transition"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
