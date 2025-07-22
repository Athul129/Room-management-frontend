

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const StaffProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaffProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await API.get("profile-staff/");
                if (res.data.Success) {
                    setProfile(res.data.data);
                } else {
                    setError(res.data.message || "Failed to load profile data");
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
                setError(error.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchStaffProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center mb-4">
                    <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Profile Load Error</h2>
                <p className="text-gray-600 text-center mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Profile Header with Staff Badge */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative">
                        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                            STAFF ID: {profile.staff_id}
                        </div>
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-md">
                                    <span className="text-3xl font-bold text-indigo-600">
                                        {profile.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl font-bold">{profile.username}</h1>
                                <p className="text-indigo-100">{profile.email}</p>
                                <p className="text-indigo-100 mt-1">{profile.phonenumber || "No phone provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Staff Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                                    <p className="mt-1 text-gray-900">{profile.username}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                                    <p className="mt-1 text-gray-900">{profile.email}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                                    <p className="mt-1 text-gray-900">{profile.phonenumber || "Not provided"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                    <p className="mt-1 text-gray-900">{profile.address || "Not provided"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate("/Staff-edit")}
                                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </button>
                            <button
                                onClick={() => navigate("/change-password")}
                                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Additional Staff Information Section */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Staff ID</h3>
                                <p className="mt-1 text-gray-900 font-mono">{profile.staff_id}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                                <p className="mt-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        Staff Account
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;