import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Search, Ticket as TicketIcon, User, MapPin, CreditCard, CheckCircle, Plane, AlertTriangle, Briefcase, Globe, ShieldCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (str, pattern) => {
  if (!str) return '—';
  try {
    const d = parseISO(str);
    return isNaN(d.getTime()) ? '—' : format(d, pattern);
  } catch {
    return '—';
  }
};

const usd = (val) =>
  Number(val).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ── sub-components ────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
    <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 flex items-center gap-2">
      {icon} {label}
    </span>
    <span className="text-sm font-black text-sky-navy text-right max-w-[60%] truncate">{value}</span>
  </div>
);

const StatusChip = ({ status }) => {
  const map = {
    Confirmed: 'bg-emerald-500 text-white border-emerald-500',
    Pending:   'bg-amber-500  text-white  border-amber-500',
    Cancelled: 'bg-red-500    text-white    border-red-500',
  };
  return (
    <span className={`text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border shadow-lg shadow-black/5 ${map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
};

const InstallmentRow = ({ inst, idx }) => {
  const paid    = !!inst.paid_at;
  const hasPen  = parseFloat(inst.penalty) > 0;

  return (
    <div className={`relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] mb-4 transition-all duration-300
      ${paid ? 'bg-gray-50 border border-gray-100' : 'bg-amber-50 border border-amber-200 shadow-xl shadow-amber-500/5'}`}>

      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 shadow-lg
          ${paid ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-400 text-white shadow-amber-400/20'}`}>
          {idx + 1}
        </div>
        <div>
          <p className="text-xl font-black text-sky-navy">{usd(inst.amount)}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            Due {fmt(inst.due_date, 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-black/5 pt-4 md:pt-0">
        {paid ? (
          <div className="flex items-center gap-2">
            <div className="text-right">
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Paid</p>
               <p className="text-[10px] text-gray-400 font-bold mt-1">{fmt(inst.paid_at, 'MMM d, yyyy')}</p>
            </div>
            <CheckCircle size={20} className="text-emerald-500" />
          </div>
        ) : (
          <span className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em] bg-amber-100 px-3 py-1 rounded-full">Outstanding</span>
        )}

        {hasPen && (
          <span className="text-[10px] font-black text-red-500 flex items-center gap-1 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <AlertTriangle size={10} /> +{usd(inst.penalty)} Penalty
          </span>
        )}
      </div>
    </div>
  );
};

// ── main page ─────────────────────────────────────────────────────────────────
const Ticket = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticketId, setTicketId]         = useState(searchParams.get('id') || '');
  const [booking, setBooking]           = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const fetchTicket = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setBooking(null);
    try {
      const { data } = await api.get(`/ticket.php?id=${id}`);
      if (data.success) {
        setBooking(data.data);
      } else {
        setError(data.error || 'Ticket not found.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const initFetch = async () => {
        await fetchTicket(id);
      };
      initFetch();
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (ticketId.trim()) setSearchParams({ id: ticketId.trim() });
  };

  const totalPaid    = booking?.installments?.reduce((s, i) => s + (i.paid_at ? parseFloat(i.amount) : 0), 0) ?? 0;
  const penaltyTotal = parseFloat(booking?.penalty_applied ?? 0);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Header */}
      <div className="bg-sky-navy text-white pt-16 pb-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
            Manage <span className="text-sky-red italic">Booking</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Access your itinerary and payment plan</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 pb-24">
        {/* Search Bar */}
        <div className="bg-white rounded-[40px] shadow-2xl p-2 mb-12 border border-gray-100 max-w-2xl mx-auto relative z-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <TicketIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-red" size={20} />
              <input
                type="text"
                placeholder="TK-2026-XXXXXX"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[32px] text-lg font-black font-mono tracking-widest outline-none focus:border-sky-red transition-all placeholder:text-gray-300 text-sky-navy uppercase"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value.toUpperCase())}
              />
            </div>
            <button
              type="submit"
              className="bg-sky-navy hover:bg-sky-red text-white px-10 py-5 rounded-[32px] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-sky-navy/20 active:scale-95"
            >
              <Search size={18} /> Find Ticket
            </button>
          </form>
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center py-24 gap-6">
            <div className="w-12 h-12 border-4 border-sky-red border-t-transparent rounded-full animate-spin shadow-xl" />
            <p className="text-xs text-gray-400 font-black uppercase tracking-[0.3em] animate-pulse">Syncing with Central Server…</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border-2 border-red-100 rounded-[40px] p-12 text-center shadow-xl">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
               <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-sky-navy mb-2 uppercase">Ticket Not Found</h3>
            <p className="text-gray-500 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && !booking && (
          <div className="flex flex-col items-center py-24 gap-6 bg-white rounded-[40px] border-2 border-dashed border-gray-200 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
              <TicketIcon size={48} />
            </div>
            <p className="text-gray-400 text-sm font-black uppercase tracking-widest">Enter a Ticket ID to begin</p>
          </div>
        )}

        {!loading && booking && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* ── Main Ticket Header Card ── */}
            <div className="bg-sky-navy rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(10,22,40,0.3)]">
              {/* decor */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-red/10 rounded-full blur-3xl" />
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full" />

              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/10 pb-10">
                <div>
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 mb-3">Ticket ID</p>
                  <p className="text-4xl md:text-5xl font-black font-mono tracking-tighter leading-none">{booking.ticket_id}</p>
                  <div className="flex items-center gap-4 mt-6">
                    <StatusChip status={booking.status} />
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       <CreditCard size={14} className="text-sky-red" /> {booking.payment_type} Plan
                    </span>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 mb-2">Total Fare</p>
                  <p className="text-5xl font-black tracking-tighter text-sky-red leading-none">{usd(booking.total_price)}</p>
                  {penaltyTotal > 0 && (
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full mt-4">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="text-[10px] text-red-400 font-black uppercase tracking-widest">Incl. {usd(penaltyTotal)} Penalty</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Route Display */}
              <div className="relative mt-10 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
                <div className="text-center md:text-left">
                  <p className="text-5xl font-black tracking-tighter mb-2">{booking.origin}</p>
                  <p className="text-xl font-black text-sky-red leading-none">{fmt(booking.departure_time, 'HH:mm')}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-3">{fmt(booking.departure_time, 'MMM d, yyyy')}</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full flex items-center justify-center px-4">
                    <div className="w-full h-px bg-white/10" />
                    <div className="absolute bg-sky-navy px-4">
                      <Plane size={24} className="text-sky-red" />
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="text-[9px] bg-white/5 border border-white/10 px-3 py-1 rounded-full font-black uppercase tracking-widest text-gray-300">{booking.cabin_class}</span>
                    <span className="text-[9px] bg-white/5 border border-white/10 px-3 py-1 rounded-full font-black uppercase tracking-widest text-gray-300">{booking.flight_number}</span>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-5xl font-black tracking-tighter mb-2">{booking.destination}</p>
                  <p className="text-xl font-black text-sky-red leading-none">{fmt(booking.arrival_time, 'HH:mm')}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-3">{fmt(booking.arrival_time, 'MMM d, yyyy')}</p>
                </div>
              </div>
            </div>

            {/* ── Details Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-black/5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-red mb-8 flex items-center gap-3">
                  <User size={16} /> Passenger Identity
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Legal Name"    value={booking.name}        icon={<User size={12} />} />
                  <InfoRow label="Passport"      value={booking.passport_no}  icon={<ShieldCheck size={12} />} />
                  <InfoRow label="Nationality"   value={booking.nationality}  icon={<Globe size={12} />} />
                  <InfoRow label="Email Access"  value={booking.email}        icon={<Globe size={12} />} />
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-black/5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-red mb-8 flex items-center gap-3">
                  <MapPin size={16} /> Technical Logistics
                </h3>
                <div className="space-y-2">
                  <InfoRow label="Flight Route"   value={`${booking.origin} → ${booking.destination}`} icon={<Plane size={12} />} />
                  <InfoRow label="Service ID"     value={booking.flight_number}                        icon={<TicketIcon size={12} />} />
                  <InfoRow label="Seat Class"     value={booking.cabin_class}                          icon={<Briefcase size={12} />} />
                  <InfoRow label="Aircraft"       value="Airbus A350-900"                             icon={<Plane size={12} />} />
                </div>
              </div>
            </div>

            {/* ── Payment Plan ── */}
            {booking.payment_type === 'Installment' && booking.installments?.length > 0 && (
              <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-sky-red flex items-center gap-3 mb-2">
                      <CreditCard size={18} /> Financial Schedule
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Split payment processing details</p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid to Date</span>
                    <span className="text-3xl font-black text-sky-navy">{usd(totalPaid)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {booking.installments.map((inst, i) => (
                    <InstallmentRow key={inst.id} inst={inst} idx={i} />
                  ))}
                </div>

                <div className="mt-10 bg-sky-navy rounded-3xl p-6 text-white flex items-center justify-between border border-white/10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sky-red">
                         <ShieldCheck size={20} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[180px]">Protected by SkyBridge Financial Guarantee</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Remaining Balance</p>
                      <p className="text-xl font-black">{usd(parseFloat(booking.total_price) - totalPaid)}</p>
                   </div>
                </div>
              </div>
            )}

            {booking.payment_type === 'Full' && (
              <div className="bg-emerald-500 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-emerald-500/20">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Account Fully Settled</h3>
                  <p className="text-emerald-100 font-medium leading-relaxed">This booking is paid in full. No further action is required from your side. We look forward to seeing you on board.</p>
                </div>
                <button className="bg-white text-emerald-600 px-8 py-4 rounded-[32px] font-black uppercase tracking-widest text-xs hover:bg-emerald-50 transition-colors shadow-lg">Download Receipt</button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;
