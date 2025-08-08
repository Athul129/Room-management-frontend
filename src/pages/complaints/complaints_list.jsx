
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/api";
import { 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaClock, 
  FaUser, 
  FaEnvelope,
  FaCalendarAlt,
  FaSearch
} from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

const AdminComplaintList = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await API.get("/admin/complaints/");
            if (response.data.Success) {
                setComplaints(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch complaints. Please try again.",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const markAsResolved = async (id) => {
        const result = await Swal.fire({
            title: "Mark as resolved?",
            text: "Are you sure you want to mark this complaint as resolved?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, mark resolved",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                const response = await API.post(`/admin/complaints/${id}/resolve/`);
                if (response.data.Success) {
                    Swal.fire({
                        icon: "success",
                        title: "Resolved!",
                        text: "Complaint has been marked as resolved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    fetchComplaints();
                }
            } catch (error) {
                console.error("Resolve error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to resolve complaint. Please try again.",
                    confirmButtonColor: "#3085d6",
                });
            }
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = complaint.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            complaint.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || 
                             (filterStatus === "resolved" && complaint.is_resolved) ||
                             (filterStatus === "pending" && !complaint.is_resolved);
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (isResolved) => {
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isResolved 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
            }`}>
                {isResolved ? (
                    <>
                        <FaCheckCircle className="mr-1" /> Resolved
                    </>
                ) : (
                    <>
                        <FaClock className="mr-1" /> Pending
                    </>
                )}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <FaExclamationCircle className="mr-3" />
                        Customer Complaints
                    </h2>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search complaints by user or message..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Filter:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {filteredComplaints.length === 0 ? (
                        <div className="text-center py-12">
                            {searchTerm || filterStatus !== "all" ? (
                                <>
                                    <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700">No matching complaints found</h3>
                                    <p className="text-gray-500 mt-1">
                                        Try adjusting your search or filter criteria
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FaExclamationCircle className="mx-auto text-4xl text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700">No Complaints Yet</h3>
                                    <p className="text-gray-500 mt-1">
                                        All customer complaints will appear here
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {filteredComplaints.map((c) => (
                                <li
                                    key={c.id}
                                    className={`border rounded-lg overflow-hidden transition-all ${c.is_resolved ? "border-green-200 bg-green-50" : "border-yellow-200 bg-white"}`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                    <FaUser size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{c.user}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <FaCalendarAlt className="mr-1" size={12} />
                                                        <span>
                                                            {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {getStatusBadge(c.is_resolved)}
                                        </div>

                                        <div className="pl-11">
                                            <div className="flex items-start mb-3">
                                                <div className="p-2 rounded-full bg-gray-100 text-gray-600 mr-3">
                                                    <FaEnvelope size={16} />
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-line">{c.message}</p>
                                            </div>

                                            {!c.is_resolved && (
                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        onClick={() => markAsResolved(c.id)}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                    >
                                                        <FaCheckCircle className="mr-2" />
                                                        Mark as Resolved
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminComplaintList;