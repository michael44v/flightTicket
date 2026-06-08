import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Search, Ticket as TicketIcon, User, MapPin, CreditCard, CheckCircle, Plane, AlertTriangle } from 'lucide-react';
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
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
    <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">{label}</span>
    <span className="text-sm font-bold text-slate-800 text-right max-w-[60%] truncate">{value}</span>
  </div>
);

const StatusChip = ({ status }) => {
  const map = {
    Confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Pending:   'bg-amber-50  text-amber-600  border-amber-200',
    Cancelled: 'bg-red-50    text-red-600    border-red-200',
  };
  return (
    <span className={`text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
};

const InstallmentRow = ({ inst, idx }) => {
  const paid    = !!inst.paid_at;
  const hasPen  = parseFloat(inst.penalty) > 0;
  const lateBy  = paid
    ? Math.round((parseISO(inst.paid_at) - parseISO(inst.due_date)) / 86400000)
    : null;

  return (
    <div className={`relative grid grid-cols-[32px_1fr_auto] gap-4 items-start py-5 px-6 rounded-2xl mb-3
      ${paid ? 'bg-slate-50 border border-slate-100' : 'bg-amber-50 border border-amber-200'}`}>

      {/* step circle */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0
        ${paid ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
        {idx + 1}
      </div>

      <div className="min-w-0">
        <p className="text-base font-black text-slate-800">{usd(inst.amount)}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Due {fmt(inst.due_date, 'MMM d, yyyy')}
        </p>
        {paid && (
          <p className={`text-xs mt-1 font-semibold ${lateBy > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            Paid {fmt(inst.paid_at, 'MMM d, yyyy')}
            {lateBy > 0 ? ` · ${lateBy}d late` : ' · on time'}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1">
        {paid
          ? <CheckCircle size={18} className="text-emerald-500" />
          : <span className="text-[11px] font-black uppercase text-amber-600 tracking-wide">Unpaid</span>
        }
        {hasPen && (
          <span className="text-[11px] font-bold text-red-500 flex items-center gap-0.5">
            <AlertTriangle size={11} /> +{usd(inst.penalty)}
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
    if (id) fetchTicket(id);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (ticketId.trim()) setSearchParams({ id: ticketId.trim() });
  };

  const totalPaid    = booking?.installments?.reduce((s, i) => s + (i.paid_at ? parseFloat(i.amount) : 0), 0) ?? 0;
  const penaltyTotal = parseFloat(booking?.penalty_applied ?? 0);

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-[system-ui]">
      {/* top bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <div className="bg-sky-600 p-2 rounded-xl">
          <Plane size={18} className="text-white" />
        </div>
        <span className="text-sm font-black tracking-tight text-slate-800">SkyBook</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Manage Booking</h1>
          <p className="text-slate-400 text-sm">Enter your Ticket ID to view your itinerary and payment plan.</p>
        </div>

        {/* search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-12">
          <div className="relative flex-1">
            <TicketIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="TK-2026-XXXXXX"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-slate-300 text-slate-800"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            />
          </div>
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-6 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Search size={16} /> Find
          </button>
        </form>

        {/* states */}
        {loading && (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-8 h-8 border-[3px] border-sky-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Looking up ticket…</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-bold text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && !booking && (
          <div className="flex flex-col items-center py-24 gap-3 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <TicketIcon size={48} className="text-slate-200" />
            <p className="text-slate-400 text-sm font-semibold">No booking loaded yet</p>
          </div>
        )}

        {!loading && booking && (
          <div className="space-y-6">

            {/* ── hero card ── */}
            <div className="bg-sky-600 rounded-3xl p-8 text-white relative overflow-hidden">
              {/* decorative circle */}
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -right-2 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />

              <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-sky-300 mb-1">Ticket ID</p>
                  <p className="text-2xl font-black font-mono tracking-tight">{booking.ticket_id}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <StatusChip status={booking.status} />
                    <span className="text-[11px] text-sky-300 font-bold uppercase tracking-wider">{booking.payment_type}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-sky-300 mb-1">Total Fare</p>
                  <p className="text-3xl font-black">{usd(booking.total_price)}</p>
                  {penaltyTotal > 0 && (
                    <p className="text-xs text-red-300 mt-1 font-bold">
                      incl. {usd(penaltyTotal)} penalty
                    </p>
                  )}
                </div>
              </div>

              {/* route strip */}
              <div className="relative mt-8 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-black tracking-tighter">{booking.origin}</p>
                  <p className="text-xs text-sky-200 font-bold mt-1">{fmt(booking.departure_time, 'HH:mm')}</p>
                  <p className="text-[11px] text-sky-300">{fmt(booking.departure_time, 'MMM d, yyyy')}</p>
                </div>

                <div className="flex-1 flex flex-col items-center px-4 gap-1">
                  <div className="flex items-center w-full gap-2">
                    <div className="flex-1 border-t border-dashed border-white/30" />
                    <Plane size={16} className="text-white/60 rotate-0" />
                    <div className="flex-1 border-t border-dashed border-white/30" />
                  </div>
                  <p className="text-[11px] text-sky-300 font-semibold">{booking.cabin_class} · {booking.flight_number}</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-black tracking-tighter">{booking.destination}</p>
                  <p className="text-xs text-sky-200 font-bold mt-1">{fmt(booking.arrival_time, 'HH:mm')}</p>
                  <p className="text-[11px] text-sky-300">{fmt(booking.arrival_time, 'MMM d, yyyy')}</p>
                </div>
              </div>
            </div>

            {/* ── passenger + flight details ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <User size={13} /> Passenger
                </h3>
                <InfoRow label="Name"        value={booking.name} />
                <InfoRow label="Passport"    value={booking.passport_no} />
                <InfoRow label="Nationality" value={booking.nationality} />
                <InfoRow label="Email"       value={booking.email} />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <MapPin size={13} /> Flight Details
                </h3>
                <InfoRow label="Flight No"   value={booking.flight_number} />
                <InfoRow label="Route"       value={`${booking.origin} → ${booking.destination}`} />
                <InfoRow label="Departure"   value={fmt(booking.departure_time, 'MMM d, yyyy HH:mm')} />
                <InfoRow label="Arrival"     value={fmt(booking.arrival_time,   'MMM d, yyyy HH:mm')} />
                <InfoRow label="Cabin"       value={booking.cabin_class} />
              </div>
            </div>

            {/* ── installment plan ── */}
            {booking.payment_type === 'Installment' && booking.installments?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <CreditCard size={13} /> Payment Schedule
                  </h3>
                  {penaltyTotal > 0 && (
                    <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle size={11} /> {usd(penaltyTotal)} total penalty
                    </span>
                  )}
                </div>

                {booking.installments.map((inst, i) => (
                  <InstallmentRow key={inst.id} inst={inst} idx={i} />
                ))}

                {/* summary bar */}
                <div className="mt-4 bg-slate-50 rounded-xl px-5 py-4 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Paid</span>
                  <span className="text-lg font-black text-slate-800">{usd(totalPaid)}</span>
                </div>
              </div>
            )}

            {booking.payment_type === 'Full' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
                <CheckCircle size={32} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="font-black text-emerald-700">Paid in Full</p>
                  <p className="text-sm text-emerald-600">No outstanding balance on this booking.</p>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;