import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, CreditCard, ShieldCheck, Landmark, Plane, ChevronLeft, Calendar, Briefcase, Globe } from 'lucide-react';

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
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <div className="w-12 h-12 border-4 border-sky-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!flight) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
       <div className="bg-red-50 text-red-500 p-6 rounded-full mb-6">
         <Plane size={48} className="rotate-45" />
       </div>
       <h2 className="text-3xl font-black text-sky-navy mb-2">Flight Not Found</h2>
       <p className="text-gray-500 mb-8">The flight you're looking for doesn't exist or has been removed.</p>
       <button onClick={() => navigate('/')} className="bg-sky-navy text-white px-8 py-3 rounded-xl font-bold">Return Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Mini Header */}
      <div className="bg-sky-navy text-white py-6">
        <div className="container mx-auto px-4 max-w-6xl">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">
             <ChevronLeft size={16} /> Back to Results
           </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            <h1 className="text-3xl md:text-5xl font-black text-sky-navy tracking-tight">Complete your <span className="text-sky-red">booking</span></h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Passenger Info Card */}
              <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 rounded-2xl bg-sky-red/10 text-sky-red flex items-center justify-center">
                     <User size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-sky-navy">Passenger Details</h3>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">As shown on your passport</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe', icon: <User size={16} /> },
                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com', icon: <Mail size={16} /> },
                    { label: 'Passport Number', key: 'passport_no', type: 'text', placeholder: 'A1234567', icon: <ShieldCheck size={16} /> },
                    { label: 'Nationality', key: 'nationality', type: 'text', placeholder: 'Turkey', icon: <Globe size={16} /> },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        {field.icon} {field.label}
                      </label>
                      <input
                        required
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-sky-red rounded-2xl p-4 outline-none font-bold text-sky-navy transition-all"
                        value={passenger[field.key]}
                        onChange={(e) => setPassenger({...passenger, [field.key]: e.target.value})}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Selection Card */}
              <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 rounded-2xl bg-sky-red/10 text-sky-red flex items-center justify-center">
                     <CreditCard size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-sky-navy">Payment Options</h3>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Choose how you want to pay</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    onClick={() => setPaymentType('Full')}
                    className={`cursor-pointer group relative p-8 rounded-[32px] border-2 transition-all duration-300 ${paymentType === 'Full' ? 'border-sky-navy bg-sky-navy text-white shadow-2xl shadow-sky-navy/20' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <ShieldCheck className={paymentType === 'Full' ? 'text-sky-red' : 'text-gray-300 group-hover:text-sky-navy'} size={40} />
                      {paymentType === 'Full' && <div className="w-6 h-6 bg-sky-red rounded-full flex items-center justify-center"><Plane size={12} fill="white" className="text-white" /></div>}
                    </div>
                    <h4 className="font-black text-xl mb-2">Pay in Full</h4>
                    <p className={`text-sm leading-relaxed ${paymentType === 'Full' ? 'text-gray-300' : 'text-gray-500'}`}>Secure your booking instantly with a single payment.</p>
                    <p className="mt-8 font-black text-3xl tracking-tight">${flight.price}</p>
                  </div>

                  <div
                    onClick={() => setPaymentType('Installment')}
                    className={`cursor-pointer group relative p-8 rounded-[32px] border-2 transition-all duration-300 ${paymentType === 'Installment' ? 'border-sky-navy bg-sky-navy text-white shadow-2xl shadow-sky-navy/20' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <Landmark className={paymentType === 'Installment' ? 'text-sky-red' : 'text-gray-300 group-hover:text-sky-navy'} size={40} />
                      {paymentType === 'Installment' && <div className="w-6 h-6 bg-sky-red rounded-full flex items-center justify-center"><Plane size={12} fill="white" className="text-white" /></div>}
                    </div>
                    <h4 className="font-black text-xl mb-2">3 Installments</h4>
                    <p className={`text-sm leading-relaxed ${paymentType === 'Installment' ? 'text-gray-300' : 'text-gray-500'}`}>Split the cost over 3 months. No hidden fees.</p>
                    <p className="mt-8 font-black text-3xl tracking-tight">${(flight.price / 3).toFixed(2)}<span className="text-sm font-bold uppercase tracking-widest ml-1 opacity-60">/mo</span></p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-20 bg-sky-red text-white font-black rounded-3xl hover:bg-red-700 active:scale-[0.98] transition-all text-xl uppercase tracking-[0.1em] shadow-2xl shadow-red-500/30 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {submitting ? (
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <Plane size={24} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Sidebar: Flight Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-sky-navy rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-sky-red opacity-10 rounded-full -mr-16 -mt-16"></div>

               <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                 <Plane size={20} className="text-sky-red" /> Flight Summary
               </h3>

               <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                     <div className="text-center">
                        <p className="text-2xl font-black">{flight.origin}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Departure</p>
                     </div>
                     <div className="flex-grow flex flex-col items-center px-4">
                        <Plane size={14} className="text-sky-red mb-1" />
                        <div className="w-full h-px bg-white/10 relative">
                           <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full"></div>
                        </div>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-black">{flight.destination}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Arrival</p>
                     </div>
                  </div>

                  <div className="space-y-4 px-2">
                     {[
                       { label: 'Flight Number', val: flight.flight_number, icon: <Plane size={14} /> },
                       { label: 'Travel Date', val: flight.departure_time.split(' ')[0], icon: <Calendar size={14} /> },
                       { label: 'Cabin Class', val: flight.cabin_class, icon: <Briefcase size={14} /> },
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center text-sm">
                         <span className="text-gray-400 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">{item.icon} {item.label}</span>
                         <span className="font-black">{item.val}</span>
                       </div>
                     ))}
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-8">
                     <div className="flex justify-between items-end">
                        <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Fare</div>
                        <div className="text-4xl font-black tracking-tighter">$<span className="text-sky-red">{flight.price}</span></div>
                     </div>
                  </div>
               </div>

               <div className="mt-10 bg-white/5 rounded-2xl p-4 border border-white/5 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-300 font-bold leading-relaxed uppercase tracking-wider">
                    All taxes and fees included. Secure SSL encrypted transaction.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Book;
