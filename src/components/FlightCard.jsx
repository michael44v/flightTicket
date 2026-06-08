import { Plane, Clock, ShieldCheck, Coffee, Wifi } from 'lucide-react';
import { format } from 'date-fns';

const FlightCard = ({ flight, onSelect }) => {
  const durationHours = Math.floor(flight.duration / 60);
  const durationMins = flight.duration % 60;

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-0 md:p-1 flex flex-col md:flex-row">
        {/* Main Info */}
        <div className="flex-grow p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-sky-red p-3 rounded-2xl text-white shadow-lg shadow-red-500/20 group-hover:rotate-12 transition-transform">
                <Plane size={24} />
              </div>
              <div>
                <p className="font-black text-xl text-sky-navy tracking-tight">{flight.flight_number}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Turkish Airlines • {flight.airplane_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                 {[Coffee, Wifi, ShieldCheck].map((Icon, i) => (
                   <div key={i} className="w-8 h-8 rounded-full bg-gray-50 border border-white flex items-center justify-center text-gray-400">
                     <Icon size={14} />
                   </div>
                 ))}
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                On Time
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left min-w-[100px]">
              <p className="text-3xl font-black text-sky-navy leading-none mb-2">{format(new Date(flight.departure_time), 'HH:mm')}</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{flight.origin}</p>
              <p className="text-[10px] text-gray-300 font-bold mt-1">{format(new Date(flight.departure_time), 'MMM dd, yyyy')}</p>
            </div>

            <div className="flex-1 w-full max-w-[200px] flex flex-col items-center">
              <div className="flex items-center space-x-2 text-sky-navy font-bold text-xs mb-2">
                <Clock size={14} className="text-sky-red" />
                <span>{durationHours}h {durationMins}m</span>
              </div>
              <div className="relative w-full h-[2px] bg-gray-100 flex items-center justify-center">
                <div className="absolute w-2 h-2 rounded-full bg-gray-200 left-0"></div>
                <div className="absolute w-2 h-2 rounded-full bg-gray-200 right-0"></div>
                <div className="absolute bg-white px-3">
                  <Plane size={16} className="text-sky-red" />
                </div>
              </div>
              <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">{flight.stops === 0 ? 'Direct Flight' : `${flight.stops} Stop(s)`}</p>
            </div>

            <div className="text-center sm:text-right min-w-[100px]">
              <p className="text-3xl font-black text-sky-navy leading-none mb-2">{format(new Date(flight.arrival_time), 'HH:mm')}</p>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{flight.destination}</p>
              <p className="text-[10px] text-gray-300 font-bold mt-1">{format(new Date(flight.arrival_time), 'MMM dd, yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Pricing Sidebar */}
        <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 p-6 md:p-8 flex flex-row md:flex-col justify-between items-center md:justify-center md:min-w-[200px] gap-4">
          <div className="text-left md:text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{flight.cabin_class}</p>
            <div className="flex items-baseline md:justify-center gap-1">
              <span className="text-sm font-bold text-sky-navy">$</span>
              <span className="text-4xl font-black text-sky-navy">{flight.price}</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(flight)}
            className="flex-1 md:flex-none w-full bg-sky-navy text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-red transition-all shadow-lg shadow-sky-navy/10 hover:shadow-sky-red/20 transform hover:-translate-y-1"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
