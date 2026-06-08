import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FlightCard from '../components/FlightCard';
import { Filter, ArrowUpDown, PlaneTakeoff, ChevronLeft, Calendar, Briefcase } from 'lucide-react';

const Flights = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await api.get('/flights.php', { params: Object.fromEntries(searchParams) });
        if (response.data.success) {
          setFlights(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch flights", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [searchParams]);

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.duration - b.duration;
    if (sortBy === 'departure') return new Date(a.departure_time) - new Date(b.departure_time);
    return 0;
  });

  const handleSelectFlight = (flight) => {
    navigate(`/book/${flight.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Summary Header */}
      <div className="bg-sky-navy text-white py-8 md:py-12 px-4 shadow-xl">
        <div className="container mx-auto max-w-6xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back to Search
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 hidden md:block">
                <PlaneTakeoff size={32} className="text-sky-red" />
              </div>
              <div>
                <h2 className="text-3xl md:text-5xl font-black flex items-center gap-3 tracking-tighter">
                  {searchParams.get('from')}
                  <span className="text-sky-red italic">→</span>
                  {searchParams.get('to')}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400 font-bold text-sm uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-sky-red" /> {searchParams.get('date')}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-sky-red" /> {searchParams.get('cabin')} Class</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{flights.length} flights found</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-4 text-gray-400 text-[10px] font-black uppercase tracking-widest border-r border-white/10">
                <ArrowUpDown size={14} />
                <span>Sort By</span>
              </div>
              <select
                className="bg-transparent text-white px-4 py-2 font-black text-sm outline-none cursor-pointer appearance-none pr-8"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price" className="bg-sky-navy text-white">Lowest Price</option>
                <option value="duration" className="bg-sky-navy text-white">Shortest Duration</option>
                <option value="departure" className="bg-sky-navy text-white">Earliest Departure</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Flight List Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-sky-red border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlaneTakeoff size={32} className="text-sky-navy animate-pulse" />
                </div>
             </div>
             <p className="mt-8 text-sky-navy font-black text-xl uppercase tracking-widest animate-pulse">Scanning the skies...</p>
             <p className="text-gray-400 font-bold mt-2">Finding the best routes for your journey</p>
          </div>
        ) : sortedFlights.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-sky-navy uppercase tracking-widest flex items-center gap-2">
                 <Filter size={18} className="text-sky-red" /> Available Flights
               </h3>
               <span className="text-xs font-bold text-gray-400">Prices shown per adult</span>
            </div>
            {sortedFlights.map(flight => (
              <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[40px] shadow-sm border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Filter size={48} />
            </div>
            <h3 className="text-3xl font-black text-sky-navy mb-4">No Flights Found</h3>
            <p className="text-gray-500 mb-12 max-w-md mx-auto font-medium leading-relaxed">
              We couldn't find any flights matching your criteria for this date. Try exploring other dates or nearby airports.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-sky-red text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
            >
              Adjust Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;
