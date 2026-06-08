import React from 'react';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const FlightCard = ({ flight, onSelect }) => {
  const durationHours = Math.floor(flight.duration / 60);
  const durationMins = flight.duration % 60;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-red p-2 rounded-lg text-white">
              <Plane size={24} />
            </div>
            <div>
              <p className="font-bold text-lg text-sky-navy">{flight.flight_number}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Turkish Airlines</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-sky-navy">${flight.price}</p>
            <p className="text-sm text-gray-500">{flight.cabin_class}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center w-24">
            <p className="text-2xl font-bold text-sky-navy">{format(new Date(flight.departure_time), 'HH:mm')}</p>
            <p className="text-sm font-semibold text-gray-600">{flight.origin}</p>
          </div>

          <div className="flex-1 px-4 flex flex-col items-center">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Clock size={16} />
              <span className="text-xs">{durationHours}h {durationMins}m</span>
            </div>
            <div className="relative w-full h-px bg-gray-200 flex items-center justify-center">
              <div className="absolute bg-white px-2">
                <ArrowRight size={16} className="text-sky-red" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">{flight.stops === 0 ? 'Direct' : `${flight.stops} Stop(s)`}</p>
          </div>

          <div className="text-center w-24">
            <p className="text-2xl font-bold text-sky-navy">{format(new Date(flight.arrival_time), 'HH:mm')}</p>
            <p className="text-sm font-semibold text-gray-600">{flight.destination}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onSelect(flight)}
            className="bg-sky-navy text-white px-8 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
