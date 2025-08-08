

import React, { useEffect, useState } from 'react';
import API from '../../../api/api';

const StaffBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/staff/bookings/');
        if (res.data.Success) setBookings(res.data.data);
      } catch (error) {
        console.error("Failed to fetch staff bookings", error);
      }
    };
    fetchBookings();
  }, []);

  const renderStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "Pending") return <span className={`${base} bg-yellow-100 text-yellow-800`}>{status}</span>;
    if (status === "Approved") return <span className={`${base} bg-green-100 text-green-800`}>{status}</span>;
    if (status === "Rejected") return <span className={`${base} bg-red-100 text-red-800`}>{status}</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Bookings</h2>

      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          No bookings made yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Room</th>
                <th className="px-6 py-3 text-left">Booked For</th>
                <th className="px-6 py-3 text-left">Check-In</th>
                <th className="px-6 py-3 text-left">Check-Out</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{b.room.name}</td>
                  <td className="px-6 py-4 text-gray-700">{b.user}</td>
                  <td className="px-6 py-4 text-gray-700">{b.check_in}</td>
                  <td className="px-6 py-4 text-gray-700">{b.check_out}</td>
                  <td className="px-6 py-4">{renderStatusBadge(b.status)}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹{b.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffBookings;
