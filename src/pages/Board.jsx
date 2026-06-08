
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import StatusPill from "../components/StatusPill";
import { Plane, RefreshCw } from "lucide-react";
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
    } catch (error) {
      console.error("Error fetching flight logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

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
    } catch (error) {
      return "--";
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
          <div>
            <h1 className="flex items-center text-4xl font-black tracking-tight">
              <Plane
                size={40}
                className="mr-4 rotate-45 text-red-500"
              />
              FLIGHT STATUS BOARD
            </h1>

            <p className="text-gray-500 mt-2 font-mono">
              REAL-TIME UPDATES • {format(new Date(), "HH:mm:ss")}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
            <RefreshCw
              size={16}
              className="animate-spin text-red-500"
            />
            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              Auto Refreshing
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0a111e] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400">
                    Flight No
                  </th>

                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400">
                    Route
                  </th>

                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400">
                    Scheduled
                  </th>

                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-400">
                    Price
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-20 text-gray-400"
                    >
                      SYNCHRONIZING DATA...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-20 text-gray-400"
                    >
                      NO FLIGHT RECORDS FOUND
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-red-500">
                        {log.flight_number}
                      </td>

                      <td className="px-6 py-4">
                        <div>{log.route}</div>

                        <div className="text-xs text-gray-500 mt-1">
                          {log.airplane_name}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            log.type === "Arrival"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-gray-400">
                          {formatFlightDate(
                            log.scheduled_time,
                            "MMM dd, yyyy"
                          )}
                        </div>

                        <div className="font-bold">
                          {formatFlightDate(
                            log.scheduled_time,
                            "HH:mm"
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusPill status={log.status} />
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-green-400">
                        $
                        {Number(log.price).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;

