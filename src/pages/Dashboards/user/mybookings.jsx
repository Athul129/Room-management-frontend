
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../../api/api";
import { FaTimes, FaCheck, FaClock, FaHotel, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await API.get("/my-bookings/");
                if (res.data.Success) {
                    setBookings(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load bookings. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        const confirm = await Swal.fire({
            icon: "question",
            title: "Cancel Booking?",
            text: "Are you sure you want to cancel this booking?",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it",
            cancelButtonText: "No, keep it",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            reverseButtons: true,
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await API.delete(`/cancel-booking/${bookingId}/`);
            if (res.data.Success) {
                Swal.fire({
                    icon: "success",
                    title: "Cancelled!",
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                setBookings((prev) => prev.filter((b) => b.id !== bookingId));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: res.data.message,
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Server error. Please try again later.",
            });
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Approved":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FaCheck className="mr-1" /> {status}
                    </span>
                );
            case "Rejected":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <FaTimes className="mr-1" /> {status}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <FaClock className="mr-1" /> {status}
                    </span>
                );
        }
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <FaHotel className="mr-2" /> My Bookings
                    </h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-gray-500 mb-4">
                            <FaHotel className="text-5xl mx-auto opacity-30" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Bookings Found</h3>
                        <p className="text-gray-500">You haven't made any bookings yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaCalendarAlt className="inline mr-1" /> Check-in
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaCalendarAlt className="inline mr-1" /> Check-out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <GiMoneyStack className="inline mr-1" /> Total Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{booking.room_name}</div>
                                            <div className="text-sm text-gray-500">Room #{booking.room_id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-900">{formatDate(booking.check_in)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-900">{formatDate(booking.check_out)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaRupeeSign className="text-gray-500 mr-1" />
                                                <span className="font-medium">{booking.total_price.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getStatusBadge(booking.status)}
                                                {booking.status !== "Approved" && booking.status !== "Rejected" && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserBookings;