import React from 'react';
import { AlertCircle } from 'lucide-react';

const PenaltyBadge = ({ amount }) => {
  if (!amount || amount <= 0) return null;

  return (
    <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 animate-pulse">
      <AlertCircle size={20} />
      <div>
        <p className="text-xs font-bold uppercase">Penalty Applied</p>
        <p className="text-lg font-black">${parseFloat(amount).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PenaltyBadge;
