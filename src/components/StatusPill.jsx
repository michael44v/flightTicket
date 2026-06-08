import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const StatusPill = ({ status }) => {
  const statusStyles = {
    'On Time': 'bg-green-100 text-green-800',
    'Delayed': 'bg-red-100 text-red-800',
    'Landed': 'bg-gray-100 text-gray-800',
    'Boarding': 'bg-blue-100 text-blue-800',
    'Confirmed': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  return (
    <span className={twMerge(
      "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
      statusStyles[status] || 'bg-gray-100 text-gray-800'
    )}>
      {status}
    </span>
  );
};

export default StatusPill;
