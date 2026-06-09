import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronRight, CheckCircle, Clock, Plane, CreditCard, ShieldCheck } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    from: 'IST',
    to: 'CRW',
    date: '2025-08-10',
    cabin: 'Economy',
    passengers: 1
  });

  const airports = [
    { code: 'IST', name: 'Istanbul (IST)' },
    { code: 'SAW', name: 'Istanbul (SAW)' },
    { code: 'ESB', name: 'Ankara (ESB)' },
    { code: 'LHR', name: 'London Heathrow (LHR)' },
    { code: 'JFK', name: 'New York (JFK)' },
    { code: 'LAX', name: 'Los Angeles (LAX)' },
    { code: 'ORD', name: 'Chicago (ORD)' },
    { code: 'CRW', name: 'Charleston (WV) - CRW' },
    { code: 'ATL', name: 'Atlanta (ATL)' },
    { code: 'DFW', name: 'Dallas (DFW)' },
    { code: 'MIA', name: 'Miami (MIA)' },
    { code: 'DEN', name: 'Denver (DEN)' },
    { code: 'SEA', name: 'Seattle (SEA)' },
    { code: 'SFO', name: 'San Francisco (SFO)' },
    { code: 'BOS', name: 'Boston (BOS)' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(search).toString();
    navigate(`/flights?${params}`);
  };

  const destinations = [
    { name: 'Charleston, WV', code: 'CRW', image: 'https://images.unsplash.com/photo-1574041400262-675003c05f0c?auto=format&fit=crop&w=600&q=80', price: '1450' },
    { name: 'Istanbul', code: 'IST', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80', price: '1290' },
    { name: 'London', code: 'LHR', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', price: '1890' },
    { name: 'New York', code: 'JFK', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', price: '1400' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center text-white">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1920&q=80")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-navy/90 to-sky-navy/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center lg:text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Hello <br />
              <span className="text-sky-red italic">Discovery.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light mb-8 max-w-lg">
              Experience the world with Turkey's premium airline. Seamless journeys, exceptional comfort.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button className="bg-sky-red hover:bg-red-700 text-white font-black px-8 py-4 rounded-full transition-all flex items-center gap-2 text-lg">
                Book a Flight <ChevronRight size={20} />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-8 py-4 rounded-full border border-white/20 transition-all flex items-center gap-2 text-lg">
                Flight Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Card - Overlapping Hero */}
      <div className="container mx-auto px-4 relative z-20 -mt-24">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 md:p-4 border border-gray-100">
           {/* Tabs for search type */}
           <div className="flex p-2 space-x-2 border-b border-gray-100 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <button className="px-4 md:px-6 py-2 rounded-xl bg-sky-navy text-white font-bold text-sm shrink-0">Book a flight</button>
              <button className="px-4 md:px-6 py-2 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0">
                <CheckCircle size={16} /> Check-in
              </button>
              <button className="px-4 md:px-6 py-2 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0">
                <Clock size={16} /> Flight Status
              </button>
           </div>

            <form onSubmit={handleSearch} className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex flex-col text-left group">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center tracking-widest px-1">
                  <MapPin size={12} className="mr-1 text-sky-red" /> From
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-50 border-2 border-transparent group-hover:border-gray-100 focus:border-sky-red rounded-2xl p-4 outline-none font-black text-sky-navy appearance-none transition-all"
                    value={search.from}
                    onChange={(e) => setSearch({...search, from: e.target.value})}
                  >
                    {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight size={20} className="rotate-90 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-left group">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center tracking-widest px-1">
                  <MapPin size={12} className="mr-1 text-sky-red" /> To
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-50 border-2 border-transparent group-hover:border-gray-100 focus:border-sky-red rounded-2xl p-4 outline-none font-black text-sky-navy appearance-none transition-all"
                    value={search.to}
                    onChange={(e) => setSearch({...search, to: e.target.value})}
                  >
                    {airports.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight size={20} className="rotate-90 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col text-left group">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center tracking-widest px-1">
                  <Calendar size={12} className="mr-1 text-sky-red" /> Travel Date
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-50 border-2 border-transparent group-hover:border-gray-100 focus:border-sky-red rounded-2xl p-4 outline-none font-black text-sky-navy transition-all"
                  value={search.date}
                  onChange={(e) => setSearch({...search, date: e.target.value})}
                />
              </div>

              <div className="flex flex-col text-left group">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center tracking-widest px-1">
                  <Users size={12} className="mr-1 text-sky-red" /> Passengers
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-50 border-2 border-transparent group-hover:border-gray-100 focus:border-sky-red rounded-2xl p-4 outline-none font-black text-sky-navy appearance-none transition-all"
                    value={search.passengers}
                    onChange={(e) => setSearch({...search, passengers: e.target.value})}
                  >
                    {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight size={20} className="rotate-90 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[60px] bg-sky-red text-white font-black rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-red-500/30 group"
                >
                  <Search size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-lg">Find Flights</span>
                </button>
              </div>
            </form>
        </div>
      </div>

      {/* Travel Services Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-sky-navy mb-4">Fly with the <span className="text-sky-red">best</span>.</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto">Discover our world-class services designed to make your journey as comfortable and enjoyable as possible.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Plane size={32} />, name: 'Flight Status', desc: 'Track your flight in real-time' },
              { icon: <CheckCircle size={32} />, name: 'Online Check-in', desc: 'Save time at the airport' },
              { icon: <CreditCard size={32} />, name: 'Manage Booking', desc: 'Change or upgrade your trip' },
              { icon: <ShieldCheck size={32} />, name: 'Travel Insurance', desc: 'Peace of mind for your trip' },
            ].map((service, i) => (
              <div key={i} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-sky-navy group-hover:bg-sky-red group-hover:text-white transition-all duration-300 mb-6 shadow-sm border border-gray-100 group-hover:rotate-6">
                  {service.icon}
                </div>
                <h3 className="font-black text-sky-navy mb-2">{service.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed px-4">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-sky-navy mb-2">Top <span className="text-sky-red">Destinations</span></h2>
              <p className="text-gray-500">Explore our most popular routes from Istanbul</p>
            </div>
            <button className="hidden md:flex items-center gap-2 font-black text-sky-navy hover:text-sky-red transition-colors uppercase tracking-widest text-sm">
              View all <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest, i) => (
              <div key={i} className="group relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl cursor-pointer hover:-translate-y-2 transition-all duration-500">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-navy via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <p className="text-sky-red font-black text-xs uppercase tracking-widest mb-2">Starting from</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-3xl font-black mb-1">{dest.name}</h3>
                      <div className="flex items-center text-gray-300 text-sm font-bold">
                        <MapPin size={14} className="mr-1" /> {dest.code} Terminal
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-2xl font-black">${dest.price}</p>
                      <p className="text-gray-400 text-[10px] font-bold">ONE WAY</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Turkish Heritage Section */}
      <div className="py-32 bg-sky-navy text-white overflow-hidden relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 scale-150 rotate-12">
          <Plane size={500} fill="white" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Turkish hospitality, <br />
              <span className="text-sky-red">redefined.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  At SkyBridge Airlines, we bring the warmth and richness of Turkish culture to the skies. Every detail of your journey is crafted with care.
                </p>
                <ul className="space-y-4">
                  {['Award-winning Turkish Cuisine', 'Modern & Young Fleet', 'World-class In-flight Entertainment', 'Luxury Lounge Experience'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-gray-100">
                      <div className="w-6 h-6 rounded-full bg-sky-red/20 flex items-center justify-center text-sky-red">
                        <CheckCircle size={14} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px]">
                <div className="text-5xl font-black text-sky-red mb-4">400+</div>
                <div className="text-xl font-bold mb-4">Destinations Worldwide</div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Connecting more countries than any other airline. From the heart of Istanbul to the far reaches of the globe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
