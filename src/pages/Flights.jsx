import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FlightCard from '../components/FlightCard';
import { Filter, ArrowUpDown, PlaneTakeoff } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-sky-navy flex items-center">
            <PlaneTakeoff className="mr-2 text-sky-red" />
            {searchParams.get('from')} → {searchParams.get('to')}
          </h2>
          <p className="text-gray-500 font-medium">
            {searchParams.get('date')} • {searchParams.get('cabin')} Class
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2 text-gray-500 text-sm font-bold uppercase tracking-wider">
            <ArrowUpDown size={16} />
            <span>Sort by:</span>
          </div>
          <select
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-semibold outline-none focus:ring-2 focus:ring-sky-navy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price">Lowest Price</option>
            <option value="duration">Shortest Duration</option>
            <option value="departure">Earliest Departure</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-sky-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold">Finding the best flights for you...</p>
        </div>
      ) : sortedFlights.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {sortedFlights.map(flight => (
            <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Filter size={40} />
          </div>
          <h3 className="text-2xl font-bold text-sky-navy mb-2">No Flights Found</h3>
          <p className="text-gray-500 mb-8">Try adjusting your filters or searching for another date.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-sky-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90"
          >
            Back to Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Flights;
