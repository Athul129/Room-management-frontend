
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../../../../api/api";
import { FiTrash2, FiAlertTriangle, FiCalendar, FiUser, FiHome } from "react-icons/fi";
import { format } from 'date-fns';

const BookingsRejected = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Format date for display
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch {
            return dateString;
        }
    };

    // Fetch all rejected bookings
    const fetchRejectedBookings = async () => {
        try {
            setIsLoading(true);
            const res = await API.get("/rejected-bookings/");
            if (res.data) {
                setBookings(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch rejected bookings:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load rejected bookings",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Delete booking
    const handleDelete = async (bookingId) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Delete Booking?",
            text: "This action cannot be undone. All data will be permanently removed.",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await API.delete(`/deletebookings/${bookingId}/`);
            if (res.data && res.data.message) {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: res.data.message,
                    confirmButtonColor: "#3085d6",
                });
                fetchRejectedBookings(); // Refresh list
            } else {
                throw new Error("Failed to delete booking");
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete booking",
                confirmButtonColor: "#3085d6",
            });
        }
    };

    useEffect(() => {
        fetchRejectedBookings();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <FiAlertTriangle className="text-red-500 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Rejected Bookings</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center p-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiAlertTriangle className="text-gray-400 text-3xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No rejected bookings</h3>
                            <p className="text-gray-500">All approved bookings will appear here</p>
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
                                            <FiHome className="inline mr-1" />
                                            Room
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <FiUser className="inline mr-1" />
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <FiCalendar className="inline mr-1" />
                                            Check-in
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <FiCalendar className="inline mr-1" />
                                            Check-out
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map((booking) => (
                                        <tr key={booking.booking_id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{booking.booking_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.room_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.customer_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(booking.check_in)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(booking.check_out)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDelete(booking.booking_id)}
                                                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                    title="Delete booking"
                                                >
                                                    <FiTrash2 className="mr-1" />
                                                    Delete
                                                </button>
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

export default BookingsRejected;