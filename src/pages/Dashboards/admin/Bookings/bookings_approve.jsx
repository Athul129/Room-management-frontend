

import React, { useEffect, useState } from "react";
import API from "../../../../api/api";
import { FaHotel, FaUser, FaCalendarAlt, FaCheckCircle, FaSearch } from "react-icons/fa";
import { format } from 'date-fns';

const BookingsApproved = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBookings = async () => {
        try {
            const res = await API.get("/approved-bookings/");
            if (res.data.Success) {
                setBookings(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch approved bookings:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load approved bookings. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => 
        booking.room_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_id.toString().includes(searchTerm)
    );

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <FaCheckCircle className="mr-3" />
                        Approved Bookings
                    </h2>
                </div>

                <div className="p-6">
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search bookings by room, customer or ID..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-8">
                            {searchTerm ? (
                                <>
                                    <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700">No matching bookings found</h3>
                                    <p className="text-gray-500 mt-1">Try adjusting your search query</p>
                                </>
                            ) : (
                                <>
                                    <FaHotel className="mx-auto text-4xl text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700">No Approved Bookings</h3>
                                    <p className="text-gray-500 mt-1">All approved bookings will appear here</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Booking ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <FaHotel className="inline mr-1" /> Room
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <FaUser className="inline mr-1" /> Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <FaCalendarAlt className="inline mr-1" /> Check-in
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <FaCalendarAlt className="inline mr-1" /> Check-out
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.booking_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">#{booking.booking_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{booking.room_name}</div>
                                                <div className="text-sm text-gray-500">Room #{booking.room_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{booking.customer_name}</div>
                                                <div className="text-sm text-gray-500">ID: {booking.customer_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-900">{formatDate(booking.check_in)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-gray-900">{formatDate(booking.check_out)}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingsApproved;