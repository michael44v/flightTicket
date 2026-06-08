import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, CreditCard, ShieldCheck, Landmark } from 'lucide-react';

const Book = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passenger, setPassenger] = useState({
    name: '',
    email: '',
    passport_no: '',
    nationality: 'Turkey'
  });
  const [paymentType, setPaymentType] = useState('Full');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await api.get(`/flight-details.php?id=${flightId}`);
        if (response.data.success) {
           setFlight(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [flightId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/book.php', {
        flight_id: flightId,
        passenger,
        payment_type: paymentType
      });
      if (response.data.success) {
        navigate(`/confirmation?ticketId=${response.data.data.ticket_id}`);
      }
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading flight details...</div>;
  if (!flight) return <div className="p-20 text-center font-bold text-red-500">Flight not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Booking Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Passenger Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-sky-navy mb-6 flex items-center">
                <User className="mr-2 text-sky-red" /> Passenger Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-500 uppercase">Full Name</label>
                  <input
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy"
                    value={passenger.name}
                    onChange={(e) => setPassenger({...passenger, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-500 uppercase">Email Address</label>
                  <input
                    required type="email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy"
                    value={passenger.email}
                    onChange={(e) => setPassenger({...passenger, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-500 uppercase">Passport Number</label>
                  <input
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy"
                    value={passenger.passport_no}
                    onChange={(e) => setPassenger({...passenger, passport_no: e.target.value})}
                    placeholder="A1234567"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-sm font-bold text-gray-500 uppercase">Nationality</label>
                  <input
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy"
                    value={passenger.nationality}
                    onChange={(e) => setPassenger({...passenger, nationality: e.target.value})}
                    placeholder="Turkey"
                  />
                </div>
              </div>
            </div>

            {/* Payment Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-sky-navy mb-6 flex items-center">
                <CreditCard className="mr-2 text-sky-red" /> Payment Options
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentType('Full')}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${paymentType === 'Full' ? 'border-sky-navy bg-sky-navy/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <ShieldCheck className={paymentType === 'Full' ? 'text-sky-navy' : 'text-gray-300'} size={32} />
                    {paymentType === 'Full' && <div className="w-4 h-4 bg-sky-navy rounded-full"></div>}
                  </div>
                  <h4 className="font-bold text-sky-navy">Full Payment</h4>
                  <p className="text-sm text-gray-500">Pay the total amount now and confirm your booking instantly.</p>
                  <p className="mt-4 font-black text-xl text-sky-navy">${flight.price}</p>
                </div>

                <div
                  onClick={() => setPaymentType('Installment')}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${paymentType === 'Installment' ? 'border-sky-navy bg-sky-navy/5' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Landmark className={paymentType === 'Installment' ? 'text-sky-navy' : 'text-gray-300'} size={32} />
                    {paymentType === 'Installment' && <div className="w-4 h-4 bg-sky-navy rounded-full"></div>}
                  </div>
                  <h4 className="font-bold text-sky-navy">3 Installments</h4>
                  <p className="text-sm text-gray-500">Split into 3 equal payments. 33% today, 33% in 30 days, 33% in 60 days.</p>
                  <p className="mt-4 font-black text-xl text-sky-navy">${(flight.price / 3).toFixed(2)} / month</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sky-navy text-white font-bold py-4 px-8 rounded-2xl hover:bg-opacity-95 transition-all text-xl shadow-xl shadow-sky-navy/20 flex items-center justify-center space-x-2"
            >
              {submitting ? 'Processing...' : `Confirm Booking • $${flight.price}`}
            </button>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div className="bg-sky-navy text-white rounded-2xl p-8 sticky top-8">
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 text-left">Flight Summary</h3>
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Flight</span>
                <span className="font-bold">{flight.flight_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Route</span>
                <span className="font-bold">{flight.origin} → {flight.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Class</span>
                <span className="font-bold">{flight.cabin_class}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-lg">Total Price</span>
                <span className="text-3xl font-black">${flight.price}</span>
              </div>
            </div>

            <div className="mt-8 bg-white/5 p-4 rounded-xl text-sm text-gray-300">
              <p className="flex items-start">
                <ShieldCheck size={16} className="mr-2 mt-0.5 text-green-400" />
                Secure checkout with SkyBridge. All prices are in USD.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Book;
