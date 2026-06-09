import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Calendar, Users, ChevronRight, CheckCircle,
  Clock, Plane, CreditCard, ShieldCheck, ArrowRight, Filter,
  X, ChevronDown, Star, Wifi, Utensils, Tv
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// SEEDED FLIGHT DATA  (all prices in USD, origin: Turkey)
// ─────────────────────────────────────────────────────────────
const AIRLINES = ['Turkish Airlines', 'Pegasus', 'SunExpress', 'AnadoluJet'];

const AIRPORTS = [
  { code: 'IST', name: 'Istanbul Airport',        city: 'Istanbul',  country: 'Turkey',        flag: '🇹🇷' },
  { code: 'SAW', name: 'Sabiha Gökçen',           city: 'Istanbul',  country: 'Turkey',        flag: '🇹🇷' },
  { code: 'ESB', name: 'Esenboğa Airport',         city: 'Ankara',   country: 'Turkey',        flag: '🇹🇷' },
  { code: 'LHR', name: 'Heathrow',                 city: 'London',    country: 'UK',           flag: '🇬🇧' },
  { code: 'LGW', name: 'Gatwick',                  city: 'London',    country: 'UK',           flag: '🇬🇧' },
  { code: 'MAN', name: 'Manchester Airport',       city: 'Manchester',country: 'UK',           flag: '🇬🇧' },
  { code: 'JFK', name: 'John F. Kennedy',          city: 'New York',  country: 'USA',          flag: '🇺🇸' },
  { code: 'LAX', name: 'Los Angeles Intl',         city: 'Los Angeles',country:'USA',          flag: '🇺🇸' },
  { code: 'ORD', name: "O'Hare International",     city: 'Chicago',   country: 'USA',          flag: '🇺🇸' },
  { code: 'MIA', name: 'Miami International',      city: 'Miami',     country: 'USA',          flag: '🇺🇸' },
  { code: 'BOS', name: 'Logan International',      city: 'Boston',    country: 'USA',          flag: '🇺🇸' },
  { code: 'IAD', name: 'Dulles International',     city: 'Washington',country: 'USA',          flag: '🇺🇸' },
  { code: 'CDG', name: 'Charles de Gaulle',        city: 'Paris',     country: 'France',       flag: '🇫🇷' },
  { code: 'FRA', name: 'Frankfurt Airport',        city: 'Frankfurt', country: 'Germany',      flag: '🇩🇪' },
  { code: 'AMS', name: 'Amsterdam Schiphol',       city: 'Amsterdam', country: 'Netherlands',  flag: '🇳🇱' },
  { code: 'MAD', name: 'Barajas Airport',          city: 'Madrid',    country: 'Spain',        flag: '🇪🇸' },
  { code: 'FCO', name: 'Leonardo da Vinci',        city: 'Rome',      country: 'Italy',        flag: '🇮🇹' },
  { code: 'DXB', name: 'Dubai International',      city: 'Dubai',     country: 'UAE',          flag: '🇦🇪' },
  { code: 'DOH', name: 'Hamad International',      city: 'Doha',      country: 'Qatar',        flag: '🇶🇦' },
  { code: 'SIN', name: 'Changi Airport',           city: 'Singapore', country: 'Singapore',    flag: '🇸🇬' },
  { code: 'NRT', name: 'Narita International',     city: 'Tokyo',     country: 'Japan',        flag: '🇯🇵' },
  { code: 'SYD', name: 'Kingsford Smith',          city: 'Sydney',    country: 'Australia',    flag: '🇦🇺' },
  { code: 'YYZ', name: 'Pearson International',    city: 'Toronto',   country: 'Canada',       flag: '🇨🇦' },
  { code: 'GRU', name: 'Guarulhos International',  city: 'São Paulo', country: 'Brazil',       flag: '🇧🇷' },
  { code: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg',country:'South Africa',flag: '🇿🇦' },
  { code: 'CAI', name: 'Cairo International',      city: 'Cairo',     country: 'Egypt',        flag: '🇪🇬' },
  { code: 'BKK', name: 'Suvarnabhumi Airport',     city: 'Bangkok',   country: 'Thailand',     flag: '🇹🇭' },
  { code: 'DEL', name: 'Indira Gandhi Intl',       city: 'New Delhi', country: 'India',        flag: '🇮🇳' },
  { code: 'CPH', name: 'Copenhagen Airport',       city: 'Copenhagen',country: 'Denmark',      flag: '🇩🇰' },
  { code: 'ATH', name: 'Athens Eleftherios',       city: 'Athens',    country: 'Greece',       flag: '🇬🇷' },
];

const airportMap = Object.fromEntries(AIRPORTS.map(a => [a.code, a]));

const ROUTE_SEEDS = [
  // UK
  { from:'IST', to:'LHR', duration:225, stops:0, basePrice:780  },
  { from:'IST', to:'LGW', duration:230, stops:0, basePrice:710  },
  { from:'IST', to:'MAN', duration:240, stops:0, basePrice:690  },
  { from:'SAW', to:'LHR', duration:235, stops:1, basePrice:640  },
  { from:'ESB', to:'LHR', duration:250, stops:1, basePrice:620  },
  // USA
  { from:'IST', to:'JFK', duration:655, stops:0, basePrice:1420 },
  { from:'IST', to:'LAX', duration:770, stops:1, basePrice:1580 },
  { from:'IST', to:'ORD', duration:690, stops:0, basePrice:1490 },
  { from:'IST', to:'MIA', duration:710, stops:1, basePrice:1460 },
  { from:'IST', to:'BOS', duration:660, stops:0, basePrice:1440 },
  { from:'IST', to:'IAD', duration:670, stops:0, basePrice:1410 },
  { from:'SAW', to:'JFK', duration:665, stops:1, basePrice:1350 },
  { from:'ESB', to:'JFK', duration:680, stops:1, basePrice:1300 },
  // Europe
  { from:'IST', to:'CDG', duration:195, stops:0, basePrice:420  },
  { from:'IST', to:'FRA', duration:215, stops:0, basePrice:380  },
  { from:'IST', to:'AMS', duration:220, stops:0, basePrice:360  },
  { from:'IST', to:'MAD', duration:270, stops:0, basePrice:450  },
  { from:'IST', to:'FCO', duration:175, stops:0, basePrice:340  },
  { from:'IST', to:'CPH', duration:235, stops:0, basePrice:390  },
  { from:'IST', to:'ATH', duration:105, stops:0, basePrice:180  },
  { from:'SAW', to:'CDG', duration:200, stops:1, basePrice:390  },
  // Middle East / Asia
  { from:'IST', to:'DXB', duration:275, stops:0, basePrice:520  },
  { from:'IST', to:'DOH', duration:265, stops:0, basePrice:490  },
  { from:'IST', to:'DEL', duration:440, stops:0, basePrice:680  },
  { from:'IST', to:'BKK', duration:570, stops:1, basePrice:790  },
  { from:'IST', to:'SIN', duration:600, stops:1, basePrice:850  },
  { from:'IST', to:'NRT', duration:680, stops:1, basePrice:1100 },
  // Long-haul
  { from:'IST', to:'SYD', duration:1060,stops:1, basePrice:1650 },
  { from:'IST', to:'YYZ', duration:680, stops:1, basePrice:1380 },
  { from:'IST', to:'GRU', duration:850, stops:1, basePrice:1490 },
  { from:'IST', to:'JNB', duration:600, stops:1, basePrice:920  },
  { from:'IST', to:'CAI', duration:145, stops:0, basePrice:290  },
];

const CABINS = ['Economy', 'Business', 'First'];
const CABIN_MULT = { Economy: 1, Business: 2.4, First: 4.1 };
const AMENITIES_POOL = [
  { icon: Wifi,      label: 'Wi-Fi' },
  { icon: Utensils,  label: 'Meals' },
  { icon: Tv,        label: 'Entertainment' },
  { icon: Star,      label: 'Miles' },
];

function seedFlights() {
  const flights = [];
  let id = 1;
  const today = new Date();

  ROUTE_SEEDS.forEach(route => {
    CABINS.forEach(cabin => {
      const numFlights = cabin === 'Economy' ? 4 : 2;
      for (let i = 0; i < numFlights; i++) {
        const daysAhead = 3 + (id * 7 + i * 13) % 180;
        const dep = new Date(today);
        dep.setDate(dep.getDate() + daysAhead);
        dep.setHours((6 + (id * 3 + i * 5) % 16), (id * 7 % 60), 0, 0);

        const arr = new Date(dep.getTime() + route.duration * 60000);
        const variation = ((id * 37 + i * 13) % 41) - 20;
        const price = Math.round((route.basePrice * CABIN_MULT[cabin]) * (1 + variation / 100));
        const airline = AIRLINES[(id + i) % AIRLINES.length];
        const flightNo = airline === 'Turkish Airlines' ? `TK${1000 + (id % 999)}`
                       : airline === 'Pegasus'          ? `PC${200  + (id % 499)}`
                       : airline === 'SunExpress'       ? `XQ${100  + (id % 299)}`
                       :                                  `AJ${300  + (id % 399)}`;

        const amenities = AMENITIES_POOL.filter((_, idx) => (id + idx) % 3 !== 0);

        flights.push({
          id: id++,
          flightNo,
          airline,
          from: route.from,
          to: route.to,
          departure: dep,
          arrival: arr,
          duration: route.duration,
          stops: route.stops,
          cabin,
          price,
          amenities,
          seatsLeft: 2 + (id % 9),
        });
      }
    });
  });

  return flights;
}

const ALL_FLIGHTS = seedFlights();

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const fmt = d => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtDur = mins => `${Math.floor(mins / 60)}h ${mins % 60}m`;
const fmtPrice = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// ─────────────────────────────────────────────────────────────
// AIRPORT SELECT
// ─────────────────────────────────────────────────────────────
function AirportSelect({ label, value, onChange, filterOrigin }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const options = AIRPORTS.filter(a => {
    if (filterOrigin && ['IST','SAW','ESB'].includes(a.code) === filterOrigin) return false;
    const s = q.toLowerCase();
    return !s || a.code.toLowerCase().includes(s) || a.city.toLowerCase().includes(s) || a.country.toLowerCase().includes(s);
  });

  const selected = airportMap[value];

  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
        <MapPin size={11} style={{ marginRight: 4, color: '#C0392B', verticalAlign: -1 }} aria-hidden />
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'var(--color-background-secondary)',
          border: '1.5px solid var(--color-border-tertiary)', borderRadius: 14,
          padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 8, textAlign: 'left',
          color: 'var(--color-text-primary)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 18 }}>{selected?.flag}</span>
          <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selected ? `${selected.code} — ${selected.city}` : 'Select airport'}
          </span>
        </span>
        <ChevronDown size={16} style={{ flexShrink: 0, color: 'var(--color-text-secondary)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
          background: 'var(--color-background-primary)', border: '1px solid var(--color-border-secondary)',
          borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 12px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <input
              autoFocus
              placeholder="Search city or code…"
              value={q}
              onChange={e => setQ(e.target.value)}
              style={{ width: '100%', fontSize: 13, background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)' }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {options.map(a => (
              <button
                key={a.code}
                onClick={() => { onChange(a.code); setOpen(false); setQ(''); }}
                style={{
                  width: '100%', padding: '10px 16px', background: a.code === value ? 'var(--color-background-secondary)' : 'transparent',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                  color: 'var(--color-text-primary)',
                }}
              >
                <span style={{ fontSize: 16 }}>{a.flag}</span>
                <span>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{a.code}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 6 }}>{a.city}, {a.country}</span>
                </span>
              </button>
            ))}
            {options.length === 0 && (
              <p style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>No airports found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FLIGHT CARD
// ─────────────────────────────────────────────────────────────
function FlightCard({ flight, onBook }) {
  const fromAP = airportMap[flight.from];
  const toAP   = airportMap[flight.to];

  const cabinColor = flight.cabin === 'First' ? '#7f5af0' : flight.cabin === 'Business' ? '#2563eb' : '#16a34a';

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 16, padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-secondary)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-tertiary)'}
    >
      {/* Airline */}
      <div style={{ minWidth: 130 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{flight.airline}</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>{flight.flightNo}</p>
        <span style={{
          display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 700,
          padding: '3px 8px', borderRadius: 20, letterSpacing: '0.06em',
          background: cabinColor + '18', color: cabinColor,
        }}>{flight.cabin.toUpperCase()}</span>
      </div>

      {/* Route */}
      <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>{fmt(flight.departure)}</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)' }}>{flight.from}</p>
        </div>

        <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--color-text-secondary)' }}>{fmtDur(flight.duration)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-secondary)' }} />
            {flight.stops === 0
              ? <Plane size={14} style={{ color: '#C0392B', transform: 'rotate(45deg)' }} />
              : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-border-primary)' }} />
            }
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-secondary)' }} />
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 10, color: flight.stops === 0 ? '#16a34a' : 'var(--color-text-secondary)' }}>
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>{fmt(flight.arrival)}</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)' }}>{flight.to}</p>
        </div>
      </div>

      {/* Amenities */}
      <div style={{ display: 'flex', gap: 6 }}>
        {flight.amenities.map((a, i) => (
          <span key={i} title={a.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--color-background-secondary)',
            border: '0.5px solid var(--color-border-tertiary)',
            color: 'var(--color-text-secondary)',
          }}>
            <a.icon size={13} aria-hidden />
          </span>
        ))}
      </div>

      {/* Price + CTA */}
      <div style={{ textAlign: 'right', minWidth: 130 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-secondary)' }}>from</p>
        <p style={{ margin: '2px 0 6px', fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
          {fmtPrice(flight.price)}
        </p>
        <p style={{ margin: '0 0 10px', fontSize: 10, color: flight.seatsLeft <= 3 ? '#C0392B' : 'var(--color-text-secondary)' }}>
          {flight.seatsLeft} seat{flight.seatsLeft !== 1 ? 's' : ''} left
        </p>
        <button
          onClick={() => onBook(flight)}
          style={{
            background: '#C0392B', color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto',
          }}
        >
          Select <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULTS PANEL
// ─────────────────────────────────────────────────────────────
function ResultsPanel({ results, onBook, onClose }) {
  const [sortBy, setSortBy] = useState('price');
  const [filterCabin, setFilterCabin] = useState('All');
  const [filterStops, setFilterStops] = useState('All');

  const sorted = useMemo(() => {
    let list = [...results];
    if (filterCabin !== 'All') list = list.filter(f => f.cabin === filterCabin);
    if (filterStops === 'Non-stop') list = list.filter(f => f.stops === 0);
    if (filterStops === '1 stop') list = list.filter(f => f.stops === 1);
    list.sort((a, b) => sortBy === 'price' ? a.price - b.price : a.duration - b.duration);
    return list;
  }, [results, sortBy, filterCabin, filterStops]);

  const cheapest = results.length ? Math.min(...results.map(f => f.price)) : 0;

  return (
    <div style={{ margin: '0 auto', maxWidth: 900, padding: '0 16px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0 16px', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {results.length} flights found
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Fares from {fmtPrice(cheapest)} per person
          </p>
        </div>
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)', background: 'none', border: '0.5px solid var(--color-border-secondary)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer' }}>
          <X size={14} /> New search
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
          <Filter size={13} style={{ color: 'var(--color-text-secondary)' }} />
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 700 }}>Filter:</span>
        </div>
        {['All', ...CABINS].map(c => (
          <button key={c} onClick={() => setFilterCabin(c)} style={{
            fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            background: filterCabin === c ? '#C0392B' : 'var(--color-background-secondary)',
            color: filterCabin === c ? '#fff' : 'var(--color-text-secondary)',
            border: filterCabin === c ? 'none' : '0.5px solid var(--color-border-tertiary)',
          }}>{c}</button>
        ))}
        <div style={{ width: 1, background: 'var(--color-border-tertiary)', margin: '0 4px' }} />
        {['All', 'Non-stop', '1 stop'].map(s => (
          <button key={s} onClick={() => setFilterStops(s)} style={{
            fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            background: filterStops === s ? '#1a3a6b' : 'var(--color-background-secondary)',
            color: filterStops === s ? '#fff' : 'var(--color-text-secondary)',
            border: filterStops === s ? 'none' : '0.5px solid var(--color-border-tertiary)',
          }}>{s}</button>
        ))}
        <div style={{ width: 1, background: 'var(--color-border-tertiary)', margin: '0 4px' }} />
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', alignSelf: 'center' }}>Sort:</span>
        {['price', 'duration'].map(s => (
          <button key={s} onClick={() => setSortBy(s)} style={{
            fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            background: sortBy === s ? '#2d6a4f' : 'var(--color-background-secondary)',
            color: sortBy === s ? '#fff' : 'var(--color-text-secondary)',
            border: sortBy === s ? 'none' : '0.5px solid var(--color-border-tertiary)',
          }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-secondary)' }}>
            <Plane size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: 'var(--color-text-primary)' }}>No flights match your filters</p>
            <p style={{ fontSize: 13, margin: 0 }}>Try adjusting cabin class or stop preference.</p>
          </div>
        ) : (
          sorted.map(f => <FlightCard key={f.id} flight={f} onBook={onBook} />)
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME COMPONENT
// ─────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [search, setSearch] = useState({
    from: 'IST', to: 'LHR', date: defaultDate, cabin: 'Economy', passengers: 1,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(null);

  const turkishOrigins = AIRPORTS.filter(a => ['IST','SAW','ESB'].includes(a.code));

  const handleSearch = (e) => {
    e?.preventDefault();
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      const searchDate = new Date(search.date);
      const found = ALL_FLIGHTS.filter(f => {
        const depDate = f.departure.toISOString().split('T')[0];
        const sameDay = depDate === search.date;
        const within7 = Math.abs(f.departure - searchDate) <= 7 * 86400000;
        return (
          f.from === search.from &&
          f.to === search.to &&
          (sameDay || within7) &&
          (search.cabin === 'All' || f.cabin === search.cabin)
        );
      });

      // If exact route exists but no date match, show all on that route
      const fallback = found.length === 0
        ? ALL_FLIGHTS.filter(f => f.from === search.from && f.to === search.to && (search.cabin === 'All' || f.cabin === search.cabin))
        : found;

      setResults(fallback);
      setLoading(false);
    }, 900);
  };

  const handleBook = (flight) => {
    setBooked(flight);
    navigate && typeof navigate === 'function'
      ? navigate(`/booking?flightId=${flight.id}&cabin=${flight.cabin}&passengers=${search.passengers}`)
      : setBooked(flight);
  };

  const destinations = [
    { name: 'New York', code: 'JFK', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
    { name: 'London',   code: 'LHR', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
    { name: 'Dubai',    code: 'DXB', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Tokyo',    code: 'NRT', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
  ];

  const destPrices = Object.fromEntries(
    destinations.map(d => {
      const fs = ALL_FLIGHTS.filter(f => f.from === 'IST' && f.to === d.code && f.cabin === 'Economy');
      const min = fs.length ? Math.min(...fs.map(f => f.price)) : '—';
      return [d.code, min];
    })
  );

  return (
    <div style={{ position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: 580, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: 'url("https://i.insider.com/594418a99a7af51b008b4d71?width=700")',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,20,50,0.92) 40%, rgba(10,20,50,0.45))' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, width: '100%', padding: '0 24px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#e8c97e', opacity: 0.9 }}>
            Turkey's Premium Carrier
          </p>
          <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            Hello <br />
            <span style={{ color: '#C0392B', fontStyle: 'italic' }}>Discovery.</span>
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: 18, color: 'rgba(255,255,255,0.75)', fontWeight: 400, maxWidth: 480, lineHeight: 1.6 }}>
            Seamless journeys from Istanbul to 400+ destinations worldwide.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('search-card')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Book a Flight <ChevronRight size={18} />
            </button>
            <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 50, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)' }}>
              Flight Status
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH CARD ── */}
      <div id="search-card" style={{ maxWidth: 1100, margin: '-80px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'var(--color-background-primary)', borderRadius: 24, border: '0.5px solid var(--color-border-tertiary)', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', overflow: 'visible' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '16px 20px 0', borderBottom: '0.5px solid var(--color-border-tertiary)', overflowX: 'auto' }}>
            {[
              { icon: <Plane size={14} />, label: 'Book a flight', active: true },
              { icon: <CheckCircle size={14} />, label: 'Check-in' },
              { icon: <Clock size={14} />, label: 'Flight status' },
            ].map((t, i) => (
              <button key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', border: 'none', borderRadius: '10px 10px 0 0', cursor: 'pointer',
                background: t.active ? '#1a3a6b' : 'transparent',
                color: t.active ? '#fff' : 'var(--color-text-secondary)',
                fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} style={{ padding: '24px 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, alignItems: 'end' }}>
            <AirportSelect label="From" value={search.from} onChange={v => setSearch({ ...search, from: v })} />
            <AirportSelect label="To"   value={search.to}   onChange={v => setSearch({ ...search, to: v })} />

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                <Calendar size={11} style={{ marginRight: 4, color: '#C0392B', verticalAlign: -1 }} aria-hidden /> Travel date
              </label>
              <input type="date" value={search.date} onChange={e => setSearch({ ...search, date: e.target.value })}
                style={{ width: '100%', background: 'var(--color-background-secondary)', border: '1.5px solid var(--color-border-tertiary)', borderRadius: 14, padding: '12px 14px', fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                <Users size={11} style={{ marginRight: 4, color: '#C0392B', verticalAlign: -1 }} aria-hidden /> Cabin
              </label>
              <select value={search.cabin} onChange={e => setSearch({ ...search, cabin: e.target.value })}
                style={{ width: '100%', background: 'var(--color-background-secondary)', border: '1.5px solid var(--color-border-tertiary)', borderRadius: 14, padding: '12px 14px', fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', outline: 'none', appearance: 'none', boxSizing: 'border-box' }}
              >
                {CABINS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button type="submit"
              style={{ height: 52, background: '#C0392B', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(192,57,43,0.35)' }}
            >
              <Search size={20} /> Find Flights
            </button>
          </form>
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--color-text-secondary)' }}>
          <div style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid var(--color-border-tertiary)', borderTopColor: '#C0392B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: 16, fontSize: 14, fontWeight: 700 }}>Searching flights…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── RESULTS ── */}
      {results && !loading && (
        <ResultsPanel results={results} onBook={handleBook} onClose={() => setResults(null)} />
      )}

      {/* ── SERVICES (hide when results shown) ── */}
      {!results && !loading && (
        <>
          <div style={{ padding: '100px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                Fly with the <span style={{ color: '#C0392B' }}>best.</span>
              </h2>
              <p style={{ margin: 0, fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 480, marginInline: 'auto', lineHeight: 1.7 }}>
                World-class services crafted to make every journey extraordinary.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
              {[
                { icon: Plane, name: 'Flight status', desc: 'Track your flight in real-time' },
                { icon: CheckCircle, name: 'Online check-in', desc: 'Skip the airport queue' },
                { icon: CreditCard, name: 'Manage booking', desc: 'Change or upgrade anytime' },
                { icon: ShieldCheck, name: 'Travel insurance', desc: 'Peace of mind guaranteed' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.querySelector('.svc-icon').style.background = '#C0392B'}
                  onMouseLeave={e => e.currentTarget.querySelector('.svc-icon').style.background = 'var(--color-background-secondary)'}
                >
                  <div className="svc-icon" style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, transition: 'background 0.2s' }}>
                    <s.icon size={28} style={{ color: 'var(--color-text-primary)' }} aria-hidden />
                  </div>
                  <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>{s.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── DESTINATIONS ── */}
          <div style={{ background: 'var(--color-background-secondary)', padding: '80px 24px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                    Top <span style={{ color: '#C0392B' }}>Destinations</span>
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>Most popular routes from Istanbul</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  View all <ChevronRight size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                {destinations.map((dest, i) => (
                  <div key={i}
                    onClick={() => { setSearch(s => ({ ...s, from: 'IST', to: dest.code })); handleSearch(); }}
                    style={{ position: 'relative', height: 400, borderRadius: 28, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,15,35,0.92) 40%, transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C0392B' }}>From Istanbul</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{dest.name}</p>
                          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={11} /> {dest.code}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>
                            {typeof destPrices[dest.code] === 'number' ? fmtPrice(destPrices[dest.code]) : '—'}
                          </p>
                          <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>one way</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── HERITAGE ── */}
          <div style={{ background: '#0a1a3a', color: '#fff', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
              <Plane size={500} style={{ fill: '#fff', color: '#fff' }} />
            </div>
            <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <h2 style={{ margin: '0 0 48px', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Turkish hospitality, <br />
                <span style={{ color: '#C0392B' }}>redefined.</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
                    At SkyBridge Airlines, we bring the warmth of Turkish culture to the skies.
                    Every detail crafted for your comfort.
                  </p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {['Award-winning Turkish cuisine', 'Modern & young fleet', 'World-class entertainment', 'Luxury lounge experience'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                        <CheckCircle size={16} style={{ color: '#C0392B', flexShrink: 0 }} aria-hidden /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '36px 32px' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 60, fontWeight: 900, color: '#C0392B', lineHeight: 1 }}>400+</p>
                  <p style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#fff' }}>Destinations worldwide</p>
                  <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                    Connecting more countries than any other airline — from the heart of Istanbul to every corner of the globe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;