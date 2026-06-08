import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Book from './pages/Book';
import Confirmation from './pages/Confirmation';
import Board from './pages/Board';
import Ticket from './pages/Ticket';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/book/:flightId" element={<Book />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/board" element={<Board />} />
            <Route path="/ticket" element={<Ticket />} />
          </Routes>
        </main>
        <footer className="bg-sky-navy text-white py-8 border-t border-white/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">© 2025 SkyBridge Airlines. Turkey's Window to the World.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
