import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-sky-navy text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Plane className="text-sky-red" size={32} />
          <span>SkyBridge</span>
        </Link>
        <div className="space-x-6 font-medium">
          <Link to="/" className="hover:text-sky-red transition-colors">Home</Link>
          <Link to="/board" className="hover:text-sky-red transition-colors">Flight Board</Link>
          <Link to="/ticket" className="hover:text-sky-red transition-colors">My Booking</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
