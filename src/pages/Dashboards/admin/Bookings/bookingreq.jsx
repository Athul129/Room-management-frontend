
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../../../api/api";
import { FaCheck, FaTimes, FaUser, FaHotel, FaCalendarAlt, FaRupeeSign, FaSync } from "react-icons/fa";
import { format } from 'date-fns';

const AdminBookingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRequests = async () => {
        try {
            const res = await API.get("/booking-requests/");
            if (res.data.Success) {
                setRequests(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch booking requests:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load booking requests. Please try again.",
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchRequests();
    };

    const handleAction = async (bookingId, actionType) => {
        const actionTitle = actionType === "approve" ? "Approve" : "Reject";
        const confirm = await Swal.fire({
            icon: "question",
            title: `${actionTitle} Booking Request?`,
            text: `Are you sure you want to ${actionType} this booking request?`,
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionTitle}`,
            cancelButtonText: "Cancel",
            confirmButtonColor: actionType === "approve" ? "#28a745" : "#dc3545",
            cancelButtonColor: "#6c757d",
            reverseButtons: true,
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await API.post(`/booking-action/${bookingId}/`, {
                action: actionType,
            });

            if (res.data.Success) {
                Swal.fire({
                    icon: "success",
                    title: `Booking ${actionTitle}d!`,
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchRequests(); // refresh the list
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Action Failed",
                    text: res.data.message || "Something went wrong.",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Server error. Try again later.",
            });
        }
    };

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
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <FaHotel className="mr-3" />
                            Pending Booking Requests
                        </h2>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center transition-all"
                        >
                            <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {requests.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <FaHotel className="text-5xl mx-auto" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Pending Requests</h3>
                        <p className="text-gray-500">All booking requests have been processed.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaUser className="inline mr-1" /> User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaHotel className="inline mr-1" /> Room
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaCalendarAlt className="inline mr-1" /> Check-in
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaCalendarAlt className="inline mr-1" /> Check-out
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FaRupeeSign className="inline mr-1" /> Total Price
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{booking.username || "N/A"}</div>
                                            <div className="text-sm text-gray-500">ID: {booking.user_id || "N/A"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{booking.room_name || "N/A"}</div>
                                            <div className="text-sm text-gray-500">Room #{booking.room_id || "N/A"}</div>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleAction(booking.booking_id, "approve")}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                >
                                                    <FaCheck className="mr-1" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(booking.booking_id, "reject")}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                >
                                                    <FaTimes className="mr-1" /> Reject
                                                </button>
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

export default AdminBookingRequests;