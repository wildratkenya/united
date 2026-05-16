import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, CheckCircle2, Loader2, Copy, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/lib/supabase';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  defaultService?: string;
}

const timeSlots = ['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM'];
const services = ['Dry Cleaning', 'Wash & Fold', 'Ironing & Pressing', 'Wedding Dress Care', 'Leather & Suede', 'Curtains & Drapes', 'Shirt Service', 'Duvets & Beddings'];

const stageLabels = ['Order Received', 'Processing', 'Quality Check', 'Out for Delivery', 'Delivered'];

const generateOrderId = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000 + 1000);
  const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `UDC-${year}-${letters}${rand}`;
};

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, defaultService }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: defaultService || 'Dry Cleaning',
    date: '',
    slot: timeSlots[0],
    notes: '',
  });

  React.useEffect(() => {
    if (defaultService) setForm((f) => ({ ...f, service: defaultService }));
  }, [defaultService]);

  if (!open) return null;

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);

    const orderId = generateOrderId();
    const nowStr = new Date().toLocaleString('en-US', {
      weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true,
    });

    const initialTimeline = [
      { stage: 0, label: stageLabels[0], time: nowStr, done: true },
      { stage: 1, label: stageLabels[1], time: 'Pending', done: false },
      { stage: 2, label: stageLabels[2], time: 'Pending', done: false },
      { stage: 3, label: stageLabels[3], time: 'Pending', done: false },
      { stage: 4, label: stageLabels[4], time: 'Pending', done: false },
    ];

    try {
      const { error } = await supabase.from('orders').insert({
        order_id: orderId,
        customer_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        service: form.service,
        scheduled_date: form.date,
        scheduled_slot: form.slot,
        notes: form.notes || null,
        items: [form.service],
        total_amount: 0,
        status: 'received',
        current_stage: 0,
        eta: `${form.date}, ${form.slot}`,
        timeline: initialTimeline,
      });

      if (error) throw error;

      // CRM subscribe
      try {
        await fetch('https://famous.ai/api/crm/6a0857b2724ad9ad4fbb89d9/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            source: 'booking-form',
            tags: ['booking', 'laundry', form.service.toLowerCase().replace(/ /g, '-')],
          }),
        });
      } catch {}

      setCreatedOrderId(orderId);
      setDone(true);
      toast.success('Booking confirmed!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to create booking. Try again.');
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(1);
    setDone(false);
    setCreatedOrderId('');
    setForm({ name: '', email: '', phone: '', address: '', service: defaultService || 'Dry Cleaning', date: '', slot: timeSlots[0], notes: '' });
    onClose();
  };

  const copyId = () => {
    navigator.clipboard.writeText(createdOrderId);
    toast.success('Order ID copied');
  };

  const downloadReceipt = () => {
    const receipt = `UNITED DRY CLEANERS LTD — Booking Confirmation
${'='.repeat(50)}

Order ID: ${createdOrderId}
Customer: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Service: ${form.service}
Pickup Date: ${form.date}
Time Slot: ${form.slot}
Address: ${form.address}
${form.notes ? `Notes: ${form.notes}\n` : ''}
Status: Order Received

${'='.repeat(50)}
Thank you for choosing United Dry Cleaners Ltd!
Track your order: https://united-kappa.vercel.app/track?orderId=${createdOrderId}
`;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UDC-${createdOrderId.replace('UDC-', '')}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 flex items-center justify-between p-5 z-10">
          <div>
            <h3 className="font-bold text-xl text-[#1a2332]">{done ? 'Booking Confirmed!' : 'Schedule a Pickup'}</h3>
            {!done && <p className="text-xs text-slate-500">Step {step} of 2</p>}
          </div>
          <button onClick={reset} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-[#1a2332] mb-2">Thanks, {form.name.split(' ')[0]}!</h4>
            <p className="text-slate-600 mb-2">Your pickup is scheduled for <strong>{form.date}</strong></p>
            <p className="text-slate-600 mb-6">Between <strong>{form.slot}</strong></p>
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left">
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Your Order ID</div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xl font-bold text-[#ff6b6b]">{createdOrderId}</span>
                <div className="flex gap-1">
                  <button onClick={downloadReceipt} className="p-2 rounded-lg hover:bg-slate-200 transition" title="Download Receipt">
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                  <button onClick={copyId} className="p-2 rounded-lg hover:bg-slate-200 transition" title="Copy">
                    <Copy className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">A confirmation has been sent to {form.email}. Use this ID to track your order anytime.</p>
            </div>
            <button onClick={reset} className="w-full py-3.5 bg-[#1a2332] text-white font-semibold rounded-xl hover:bg-[#0f1828] transition">
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block">Full Name *</label>
                  <input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#ff6b6b]" placeholder="Jane Mwangi" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#ff6b6b]" placeholder="jane@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block">Phone *</label>
                    <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#ff6b6b]" placeholder="+254 7XX XXX XXX" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block flex items-center gap-1"><MapPin className="w-4 h-4" />Pickup Address *</label>
                  <input value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#ff6b6b]" placeholder="Building name, street, neighborhood" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block">Service Type</label>
                  <select value={form.service} onChange={(e) => update('service', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#ff6b6b] bg-white">
                    {services.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-3.5 bg-[#ff6b6b] text-white font-semibold rounded-xl hover:bg-[#ff5252] transition">
                  Continue
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block flex items-center gap-1"><Calendar className="w-4 h-4" />Pickup Date *</label>
                  <input type="date" min={today} value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#ff6b6b]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block flex items-center gap-1"><Clock className="w-4 h-4" />Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((s) => (
                      <button key={s} type="button" onClick={() => update('slot', s)} className={`p-3 rounded-xl text-sm font-medium border transition ${form.slot === s ? 'bg-[#1a2332] text-white border-[#1a2332]' : 'bg-white text-slate-700 border-slate-200 hover:border-[#ff6b6b]'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a2332] mb-1.5 block">Special Instructions</label>
                  <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#ff6b6b] resize-none" placeholder="Any specific care instructions..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3.5 border border-slate-200 text-[#1a2332] font-semibold rounded-xl hover:bg-slate-50">
                    Back
                  </button>
                  <button onClick={submit} disabled={loading} className="flex-1 py-3.5 bg-[#ff6b6b] text-white font-semibold rounded-xl hover:bg-[#ff5252] disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
