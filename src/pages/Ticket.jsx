import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import InstallmentTable from '../components/InstallmentTable';
import PenaltyBadge from '../components/PenaltyBadge';
import StatusPill from '../components/StatusPill';
import { Search, Ticket as TicketIcon, User, MapPin, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const Ticket = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticketId, setTicketId] = useState(searchParams.get('id') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTicket = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/ticket.php?id=${id}`);
      if (response.data.success) {
        setBooking(response.data.data);
      } else {
        setError(response.data.error || 'Ticket not found');
        setBooking(null);
      }
    } catch (err) {
      setError('An error occurred while fetching the ticket');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      fetchTicket(id);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (ticketId) {
      setSearchParams({ id: ticketId });
    }
  };

  const handlePayInstallment = async (installmentId) => {
    try {
      const response = await api.post('/pay-installment.php', { installment_id: installmentId });
      if (response.data.success) {
        // Refresh ticket data
        fetchTicket(searchParams.get('id'));
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      alert('Payment failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-sky-navy mb-4">Manage My Booking</h1>
        <p className="text-gray-500">Enter your Ticket ID to view itinerary and payment details.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-12">
        <div className="relative flex-1">
          <TicketIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="TK-2025-XXXXXX"
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-sky-navy transition-all font-mono font-bold"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
          />
        </div>
        <button className="bg-sky-navy text-white px-8 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center">
          <Search size={20} className="mr-2" /> Lookup
        </button>
      </form>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-sky-red border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : booking ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Header Info */}
          <div className="bg-sky-navy rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
             <div className="flex items-center gap-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                   <TicketIcon size={32} className="text-sky-red" />
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ticket ID</p>
                   <p className="text-2xl font-black font-mono">{booking.ticket_id}</p>
                </div>
             </div>

             {booking.payment_type === 'Full' ? (
                <div className="flex items-center bg-green-500/20 text-green-400 px-6 py-3 rounded-full border border-green-500/30">
                   <CheckCircle className="mr-2" size={20} />
                   <span className="font-black uppercase tracking-wider">Paid in Full</span>
                </div>
             ) : (
                <div className="text-right">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Next Due Date</p>
                   <p className="text-xl font-bold text-sky-red">{booking.next_due_date ? format(new Date(booking.next_due_date), 'MMM dd, yyyy') : 'No pending payments'}</p>
                </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Passenger Info */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-sky-navy mb-6 flex items-center">
                <User className="mr-2 text-sky-red" size={20} /> Passenger Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm font-bold uppercase">Name</span>
                  <span className="font-bold text-sky-navy">{booking.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm font-bold uppercase">Passport</span>
                  <span className="font-bold text-sky-navy">{booking.passport_no}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm font-bold uppercase">Nationality</span>
                  <span className="font-bold text-sky-navy">{booking.nationality}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm font-bold uppercase">Email</span>
                  <span className="font-bold text-sky-navy">{booking.email}</span>
                </div>
              </div>
            </div>

            {/* Flight Info */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-sky-navy mb-6 flex items-center">
                <MapPin className="mr-2 text-sky-red" size={20} /> Flight Itinerary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-2xl font-black text-sky-navy">{booking.origin}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">{format(new Date(booking.departure_time), 'HH:mm')}</p>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="w-full h-px bg-gray-100 relative">
                      <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-sky-navy">{booking.destination}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">{format(new Date(booking.arrival_time), 'HH:mm')}</p>
                  </div>
                </div>
                <div className="flex justify-between border-t border-gray-50 pt-4">
                  <span className="text-gray-400 text-sm font-bold uppercase">Flight No</span>
                  <span className="font-bold text-sky-navy">{booking.flight_number}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 text-sm font-bold uppercase">Cabin Class</span>
                  <span className="font-bold text-sky-navy">{booking.cabin_class}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Plan */}
          {booking.payment_type === 'Installment' && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-sky-navy flex items-center">
                  <CreditCard className="mr-2 text-sky-red" size={20} /> Payment Schedule
                </h3>
                <PenaltyBadge amount={booking.penalty_applied} />
              </div>
              <InstallmentTable
                installments={booking.installments}
                onPay={handlePayInstallment}
              />
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
           <TicketIcon className="mx-auto mb-4 text-gray-300" size={64} />
           <p className="text-gray-500 font-bold">Search for a ticket ID to see details</p>
        </div>
      )}
    </div>
  );
};

export default Ticket;
