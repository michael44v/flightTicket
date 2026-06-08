import React from 'react';
import { X } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-sky-navy">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-sky-navy transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
