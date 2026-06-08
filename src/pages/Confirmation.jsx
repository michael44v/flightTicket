import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Ticket, Calendar } from 'lucide-react';

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('ticketId');

  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-green-500 p-12 text-center text-white">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6">
            <CheckCircle size={56} />
          </div>
          <h1 className="text-4xl font-black mb-2">Booking Confirmed!</h1>
          <p className="text-white/80 text-lg">Your adventure with SkyBridge is ready to begin.</p>
        </div>

        <div className="p-12 space-y-8">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Ticket ID</p>
            <p className="text-4xl font-black text-sky-navy font-mono tracking-tighter">{ticketId}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to={`/ticket?id=${ticketId}`}
              className="flex items-center justify-center space-x-2 bg-sky-navy text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all"
            >
              <Ticket size={20} />
              <span>View Ticket</span>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              <Calendar size={20} />
              <span>Home</span>
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500">
            A confirmation email has been sent to your inbox. <br/>
            Need help? Contact us at support@skybridge.tr
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
