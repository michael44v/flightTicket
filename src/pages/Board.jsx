import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusPill from '../components/StatusPill';
import { Plane, Clock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const Board = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/flight-logs.php');
      if (response.data.success) {
        setLogs(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#050b14] min-h-screen text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center">
              <Plane className="mr-4 text-sky-red rotate-45" size={40} />
              FLIGHT STATUS BOARD
            </h1>
            <p className="text-gray-500 font-mono mt-2">REAL-TIME UPDATES • {format(new Date(), 'HH:mm:ss')}</p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <RefreshCw size={16} className="text-sky-red animate-spin" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Auto-Refreshing</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0a111e] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Flight No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Route</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Scheduled</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {loading ? (
                   <tr><td colSpan="6" className="p-20 text-center animate-pulse">SYNCHRONIZING DATA...</td></tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-sky-red">{log.flight_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div>{log.route}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{log.airplane_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div>{format(new Date(log.scheduled_time), 'MMM dd')}</div>
                      <div className="font-bold text-white">{format(new Date(log.scheduled_time), 'HH:mm')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusPill status={log.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-400">${log.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
