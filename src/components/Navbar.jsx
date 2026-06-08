import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Menu, X, ChevronDown, Globe } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '#' },
    { name: 'Book & Manage', path: '/ticket' },
    { name: 'Flight Board', path: '/board' },
    { name: 'Help', path: '#' },
  ];

  return (
    <nav className="bg-sky-navy text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-tighter">
            <Plane className="text-sky-red" size={36} fill="currentColor" />
            <div className="flex flex-col leading-none">
              <span>SkyBridge</span>
              <span className="text-[10px] text-sky-red tracking-[0.2em] font-bold">AIRLINES</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8 font-bold text-sm uppercase tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-sky-red transition-colors flex items-center gap-1"
              >
                {link.name}
                {link.name === 'Discover' || link.name === 'Book & Manage' ? <ChevronDown size={14} /> : null}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="hidden lg:flex items-center space-x-6">
            <button className="flex items-center gap-2 hover:text-sky-red transition-colors text-sm font-bold uppercase">
              <Globe size={18} />
              <span>EN - TR</span>
            </button>
            <Link
              to="/ticket"
              className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full text-sm font-bold transition-all border border-white/20"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-sky-navy border-t border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-4 text-base font-bold border-b border-white/5 hover:text-sky-red transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-4">
            <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-bold uppercase tracking-wider">
              <span>Language: EN</span>
              <Globe size={18} />
            </button>
            <Link
              to="/ticket"
              className="w-full bg-sky-red text-center py-4 rounded-xl font-black text-lg uppercase tracking-widest shadow-lg shadow-sky-red/20"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
