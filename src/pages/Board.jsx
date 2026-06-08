import { useEffect, useState } from "react";
import api from "../api/axios";
import StatusPill from "../components/StatusPill";
import { RefreshCw, Clock, Globe } from "lucide-react";
import { format, parse } from "date-fns";

const Board = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/flight-logs.php");

      if (data?.success && Array.isArray(data.data)) {
        setLogs(data.data);
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchLogs();
    };
    initFetch();

    const interval = setInterval(() => {
      fetchLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatFlightDate = (dateString, formatString) => {
    try {
      if (!dateString) return "--";

      const parsedDate = parse(
        dateString,
        "yyyy-MM-dd HH:mm:ss",
        new Date()
      );

      if (isNaN(parsedDate.getTime())) {
        return "--";
      }

      return format(parsedDate, formatString);
    } catch {
      return "--";
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      {/* Premium Header */}
      <div className="bg-gradient-to-b from-[#0a1628] to-[#050b14] pt-12 pb-24 px-4 border-b border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="flex items-center gap-2 text-sky-red font-black text-xs uppercase tracking-[0.3em] mb-4">
                <Globe size={14} />
                <span>Live Network</span>
              </div>
              <h1 className="flex items-center text-4xl md:text-6xl font-black tracking-tighter">
                FLIGHT <span className="text-sky-red italic px-2">BOARD</span>
              </h1>
              <p className="text-gray-500 mt-4 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Global Synchronization • {format(new Date(), "HH:mm:ss")}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Auto Update</span>
                <span className="text-xs font-bold text-emerald-400">System Online</span>
              </div>
              <RefreshCw
                size={20}
                className="animate-spin text-sky-red"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 -mt-12 pb-24">
        {/* Desktop Table View */}
        <div className="hidden lg:block bg-[#0a111e] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Flight No</th>
                <th className="px-8 py-6 text-left text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Route & Aircraft</th>
                <th className="px-8 py-6 text-left text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Type</th>
                <th className="px-8 py-6 text-left text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Scheduled</th>
                <th className="px-8 py-6 text-left text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Status</th>
                <th className="px-8 py-6 text-right text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Fare</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-32">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-12 h-12 border-4 border-sky-red border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Synchronizing Radar Data...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-32 text-gray-500 font-black uppercase tracking-widest">No Active Flights Found</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-black text-xl text-sky-red group-hover:scale-110 inline-block transition-transform">{log.flight_number}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-lg">{log.route}</div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{log.airplane_name}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          log.type === "Arrival" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-tighter">{formatFlightDate(log.scheduled_time, "MMM dd, yyyy")}</div>
                      <div className="text-2xl font-black">{formatFlightDate(log.scheduled_time, "HH:mm")}</div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusPill status={log.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-2xl font-black text-emerald-400">${Number(log.price).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">USD / Adult</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-24 gap-4">
               <div className="w-10 h-10 border-4 border-sky-red border-t-transparent rounded-full animate-spin"></div>
               <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">Loading Radar...</span>
            </div>
          ) : logs.map((log) => (
            <div key={log.id} className="bg-[#0a111e] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-2xl font-black text-sky-red tracking-tighter">{log.flight_number}</span>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{log.airplane_name}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      log.type === "Arrival" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                    {log.type}
                  </span>
               </div>

               <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 mb-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Time</p>
                    <p className="text-xl font-black">{formatFlightDate(log.scheduled_time, "HH:mm")}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Route</p>
                    <p className="text-sm font-bold truncate px-2">{log.route}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Price</p>
                    <p className="text-xl font-black text-emerald-400">${Number(log.price).toLocaleString()}</p>
                  </div>
               </div>

               <div className="flex justify-between items-center pt-2">
                  <StatusPill status={log.status} />
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                    {formatFlightDate(log.scheduled_time, "MMM dd, yyyy")}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
