import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Briefcase } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    from: 'IST',
    to: 'LHR',
    date: '2025-08-10',
    cabin: 'Economy',
    passengers: 1
  });

  const airports = [
    { code: 'IST', name: 'Istanbul (IST)' },
    { code: 'SAW', name: 'Istanbul (SAW)' },
    { code: 'ESB', name: 'Ankara (ESB)' },
    { code: 'LHR', name: 'London Heathrow (LHR)' },
    { code: 'LGW', name: 'London Gatwick (LGW)' },
    { code: 'MAN', name: 'Manchester (MAN)' },
    { code: 'JFK', name: 'New York (JFK)' },
    { code: 'LAX', name: 'Los Angeles (LAX)' },
    { code: 'ORD', name: 'Chicago (ORD)' },
    { code: 'STN', name: 'London Stansted (STN)' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(search).toString();
    navigate(`/flights?${params}`);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="bg-sky-navy py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Where do you want <br/> to <span className="text-sky-red">explore</span>?
          </h1>
          <p className="text-gray-400 text-lg mb-12">Premium travel experiences from the heart of Turkey to the world.</p>

          {/* Search Card */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 -mb-40 relative z-10 border border-gray-100">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col text-left">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center">
                  <MapPin size={12} className="mr-1" /> From
                </label>
                <select
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy font-semibold"
                  value={search.from}
                  onChange={(e) => setSearch({...search, from: e.target.value})}
                >
                  {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center">
                  <MapPin size={12} className="mr-1" /> To
                </label>
                <select
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy font-semibold"
                  value={search.to}
                  onChange={(e) => setSearch({...search, to: e.target.value})}
                >
                  {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center">
                  <Calendar size={12} className="mr-1" /> Date
                </label>
                <input
                  type="date"
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy font-semibold"
                  value={search.date}
                  onChange={(e) => setSearch({...search, date: e.target.value})}
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center">
                  <Briefcase size={12} className="mr-1" /> Class
                </label>
                <select
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-sky-navy font-semibold"
                  value={search.cabin}
                  onChange={(e) => setSearch({...search, cabin: e.target.value})}
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-sky-red text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-sky-red/20"
                >
                  <Search size={20} />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Spacer for search card */}
      <div className="h-48"></div>
    </div>
  );
};

export default Home;
