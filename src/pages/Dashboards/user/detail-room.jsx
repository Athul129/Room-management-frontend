
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";
import Swal from "sweetalert2";
import { FiArrowLeft, FiCheckCircle, FiStar, FiWifi, FiTv, FiCoffee, FiDroplet } from "react-icons/fi";

const RoomDetail = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRoom = async () => {
        try {
            setIsLoading(true);
            const res = await API.get(`/rooms/${id}/`);
            setRoom(res.data);
        } catch (err) {
            console.error("Failed to fetch room:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load room details",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoom();
    }, [id]);

    const handleBookingClick = () => {
        if (room.status === "available") {
            navigate(`/book/${room.id}`);
        } else {
            Swal.fire({
                icon: "info",
                title: "Room Unavailable",
                text: "This room is currently not available for booking.",
                confirmButtonColor: "#3085d6",
            });
        }
    };

    const facilityIcons = {
        wifi: <FiWifi className="mr-1" />,
        tv: <FiTv className="mr-1" />,
        breakfast: <FiCoffee className="mr-1" />,
        ac: <FiDroplet className="mr-1" />,
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Room Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested room could not be loaded.</p>
                    <button
                        onClick={() => navigate("/user-home")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/user-home")}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Rooms
                </button>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Hero Image - Reduced Height */}
                    <div className="relative h-48 sm:h-56 w-full">
                        <img
                            src={room.cover_image || "https://via.placeholder.com/800x400?text=Room+Image"}
                            alt={room.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/800x400?text=Room+Image";
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-white">{room.name}</h1>
                            <div className="flex items-center mt-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                                    ))}
                                </div>
                                <span className="ml-2 text-white/90 text-sm">5.0 (24 reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Details */}
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left Column */}
                            <div className="md:w-2/3">
                                <p className="text-gray-600 mb-4">{room.details}</p>

                                {/* Highlights */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-3">Room Highlights</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-center text-sm">
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span>Spacious {room.room_type} room</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span>{room.category === "ac" ? "Air Conditioned" : "Non-AC"}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span>Free WiFi</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <FiCheckCircle className="text-green-500 mr-2" />
                                            <span>Daily housekeeping</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Facilities */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-3">Facilities</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {room.facilities.map((facility) => (
                                            <span
                                                key={facility.id}
                                                className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                                            >
                                                {facilityIcons[facility.name.toLowerCase()] || <FiCheckCircle className="mr-1" />}
                                                {facility.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Gallery */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-3">Gallery</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {room.room_images.map((img) => (
                                            <div key={img.id} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                                                <img
                                                    src={img.image}
                                                    alt="Room"
                                                    className="w-full h-32 object-cover cursor-pointer hover:scale-105 transition"
                                                    onClick={() => Swal.fire({
                                                        imageUrl: img.image,
                                                        imageAlt: 'Room image',
                                                        showConfirmButton: false,
                                                        background: 'rgba(0,0,0,0.9)',
                                                    })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Booking Card */}
                            <div className="md:w-1/3">
                                <div className="sticky top-6 border border-gray-200 rounded-lg shadow-sm p-5">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Information</h3>
                                    
                                    <div className="space-y-3 mb-5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Room Type:</span>
                                            <span className="font-medium">{room.room_type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium capitalize">{room.category}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Room Number:</span>
                                            <span className="font-medium">{room.room_number}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`font-medium ${
                                                room.status === "available" ? "text-green-600" : "text-red-600"
                                            }`}>
                                                {room.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mb-5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="text-xl font-bold text-blue-600">₹{room.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">per night (excl. taxes)</p>
                                    </div>

                                    <button
                                        onClick={handleBookingClick}
                                        disabled={room.status !== "available"}
                                        className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${
                                            room.status === "available"
                                                ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                                                : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        {room.status === "available" ? "Book Now" : "Not Available"}
                                    </button>

                                    {room.status === "available" && (
                                        <p className="text-xs text-green-600 mt-3 text-center">
                                            Only 1 room left at this price!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;