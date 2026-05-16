import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';

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

interface Message {
  from: 'bot' | 'user';
  text: string;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function findBestMatch(input: string): string | null {
  const normalized = normalize(input);
  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  const keywords: Record<string, number[]> = {};
  faqs.forEach((_, i) => {
    const qWords = normalize(faqs[i].q).split(/\s+/);
    qWords.forEach(w => {
      if (!keywords[w]) keywords[w] = [];
      if (!keywords[w].includes(i)) keywords[w].push(i);
    });
  });

  const scores = faqs.map(() => 0);
  words.forEach(w => {
    if (keywords[w]) {
      keywords[w].forEach(i => { scores[i] += 1; });
    }
  });

  let bestIdx = -1;
  let bestScore = 0;
  scores.forEach((s, i) => {
    if (s > bestScore) { bestScore = s; bestIdx = i; }
  });

  if (bestScore < 1) return null;
  return faqs[bestIdx].a;
}

const quickReplies = faqs.map(f => f.q);

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi! I\'m the United Dry Cleaners assistant. Ask me anything about our services, pricing, coverage areas, or operations.' },
  ]);
  const [input, setInput] = useState('');
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setShowQuick(false);

    setTimeout(() => {
      const answer = findBestMatch(text);
      if (answer) {
        setMessages(prev => [...prev, { from: 'bot', text: answer }]);
      } else {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: 'I\'m not sure about that. Please call us at +254 729 112 066 or send a WhatsApp message and we\'ll help you right away.',
        }]);
      }
    }, 400);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-gradient-to-r from-[#008cd5] to-[#005a8c] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">United Assistant</p>
                <p className="text-[10px] text-white/70">Online — reply in seconds</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === 'user'
                    ? 'bg-[#EE6633] text-white rounded-br-md'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {showQuick && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider px-1">Common questions</p>
                {quickReplies.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { sendMessage(q); setShowQuick(false); }}
                    className="block w-full text-left text-xs bg-white border border-slate-200 hover:border-[#008cd5] hover:text-[#008cd5] rounded-xl px-3 py-2 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200 p-3 bg-white">
            <form
              onSubmit={e => { e.preventDefault(); sendMessage(input); setInput(''); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 h-10 px-4 rounded-xl border border-slate-200 outline-none focus:border-[#008cd5] text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-10 w-10 rounded-xl bg-[#EE6633] text-white hover:bg-[#d45522] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#EE6633] text-white shadow-2xl shadow-[#EE6633]/50 hover:bg-[#d45520] hover:-translate-y-1 transition flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
};

export default ChatBot;
