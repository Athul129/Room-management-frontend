// import React, { useEffect, useState } from "react";
// import { Navigate, useParams } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Swal from "sweetalert2";
// import API from "../../api/api";
// import { useNavigate } from "react-router-dom";

// const RoomBooking = () => {
//     const { id } = useParams();
//     const [room, setRoom] = useState(null);
//     const [checkIn, setCheckIn] = useState(null);
//     const [checkOut, setCheckOut] = useState(null);
//     const [totalPrice, setTotalPrice] = useState(null);
//     const [bookedRanges, setBookedRanges] = useState([]);
//     const navigate = useNavigate();
    

//     // Fetch room details
//     const fetchRoom = async () => {
//         try {
//             const res = await API.get(`/rooms/${id}/`);
//             setRoom(res.data);
//         } catch (err) {
//             console.error("Error fetching room:", err);
//         }
//     };

//     // Fetch booked date ranges
//     const fetchBookedDates = async () => {
//         try {
//             const res = await API.get(`/rooms/${id}/booked-dates/`);
//             if (res.data.Success) {
//                 setBookedRanges(res.data.data);
//             }
//         } catch (err) {
//             console.error("Failed to fetch booked dates", err);
//         }
//     };

//     // Run on component mount
//     useEffect(() => {
//         fetchRoom();
//         fetchBookedDates();
//     }, [id]);

//     // Calculate total price when dates are valid
//     useEffect(() => {
//         if (room && checkIn && checkOut) {
//             const diffDays = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24)); //gives milliseconds  Divide by 1000 to get seconds 60 seconds in a minute 60 minutes in an hour 24 hours in a day
//             setTotalPrice(diffDays > 0 ? diffDays * room.price : null);
//         } else {
//             setTotalPrice(null);
//         }
//     }, [checkIn, checkOut, room]);

//     const formatDate = (date) => date.toISOString().split("T")[0];  // "2025-07-10T00:00:00.000Z"  .split("T")[0] splits the string at T and keeps only the first part: exact format of date


//     // Check if a date is booked (used in filterDate)
//     const isDateBooked = (date) => {  //dates passed from the datepicker 
//         return bookedRanges.some((range) => {       // a range is a time period of betwen in and out,," .some() to check if the date matches any booked range. If yes, the date is disabled in the calendar using filterDate.
//             const checkIn = new Date(range.check_in);
//             const checkOut = new Date(range.check_out);  //  Convert check-in/check-out strings to Date objects
//             return date >= checkIn && date < checkOut; //if the date is equal to or after check-in and before check-out, then the date is booked
//         });
//     };

//     const handleBooking = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await API.post("/room-booking/", {
//                 room: id,
//                 check_in: formatDate(checkIn),
//                 check_out: formatDate(checkOut),
//             });

//             if (res.data.Success) {
//                 Swal.fire({
//                     icon: "success",
//                     title: "Booking Requested!",
//                     text: "Your booking request was sent. Waiting for admin approval.",
//                     confirmButtonColor: "#3085d6",
//                 });
//                 navigate('/my-bookings'); 

//                 setCheckIn(null);
//                 setCheckOut(null);
//                 setTotalPrice(null);
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Booking Failed",
//                     text: res.data.message || "Something went wrong.",
//                     confirmButtonColor: "#d33",
//                 });
//             }
//         } catch (err) {
//             const errorText = err.response?.data?.message ||
//                 "Server error. Please try again later.";

//             Swal.fire({
//                 icon: "error",
//                 title: "Booking Failed",
//                 text: errorText,
//                 confirmButtonColor: "#d33",
//             });
//         }
//     };

//     if (!room) return <p className="p-4">Loading room details...</p>;

//     return (
//         <div className="p-4 max-w-xl mx-auto">
//             <h1 className="text-2xl font-bold mb-1">{room.name}</h1>
//             <p className="font-medium mb-1">Price per day: ₹{room.price}</p>

//             <form onSubmit={handleBooking} className="space-y-4 mt-4">
//                 <div>
//                     <label className="block font-medium">Check-in Date</label>
//                     <DatePicker
//                         selected={checkIn}
//                         onChange={(date) => setCheckIn(date)}
//                         selectsStart
//                         startDate={checkIn}
//                         endDate={checkOut}
//                         minDate={new Date()}  // Prevent past dates
//                         filterDate={(date) => !isDateBooked(date)}
//                         dateFormat="yyyy-MM-dd"
//                         className="w-full border p-2 rounded"
//                         placeholderText="Select check-in date"
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium">Check-out Date</label>
//                     <DatePicker
//                         selected={checkOut}
//                         onChange={(date) => setCheckOut(date)}
//                         selectsEnd
//                         startDate={checkIn}
//                         endDate={checkOut}
//                         minDate={checkIn || new Date()}
//                         filterDate={(date) => !isDateBooked(date)}
//                         dateFormat="yyyy-MM-dd"
//                         className="w-full border p-2 rounded"
//                         placeholderText="Select check-out date"
//                     />
//                 </div>

//                 {totalPrice !== null && ( //total price is not null we show the total price
//                     <p className="text-green-700 font-medium">Total Price: ₹{totalPrice}</p>
//                 )}

//                 <button
//                     type="submit"
//                     disabled={totalPrice === null}
//                     className={`w-full px-4 py-2 rounded text-white ${totalPrice === null
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-blue-600 hover:bg-blue-700"
//                         }`}
//                 >
//                     Confirm Booking
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default RoomBooking;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import API from "../../api/api";
import { FiCalendar, FiDollarSign, FiHome, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { format, differenceInDays } from 'date-fns';

const RoomBooking = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);
    const [bookedRanges, setBookedRanges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch room details
    const fetchRoom = async () => {
        try {
            const res = await API.get(`/rooms/${id}/`);
            setRoom(res.data);
        } catch (err) {
            console.error("Error fetching room:", err);
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

    // Fetch booked date ranges
    const fetchBookedDates = async () => {
        try {
            const res = await API.get(`/rooms/${id}/booked-dates/`);
            if (res.data.Success) {
                setBookedRanges(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch booked dates", err);
        }
    };

    useEffect(() => {
        fetchRoom();
        fetchBookedDates();
    }, [id]);

    // Calculate total price when dates are valid
    useEffect(() => {
        if (room && checkIn && checkOut) {
            const diffDays = differenceInDays(checkOut, checkIn);
            setTotalPrice(diffDays > 0 ? diffDays * room.price : null);
        } else {
            setTotalPrice(null);
        }
    }, [checkIn, checkOut, room]);

    const formatDate = (date) => format(date, 'yyyy-MM-dd');

    // Check if a date is booked
    const isDateBooked = (date) => {
        return bookedRanges.some((range) => {
            const rangeStart = new Date(range.check_in);
            const rangeEnd = new Date(range.check_out);
            return date >= rangeStart && date < rangeEnd;
        });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!checkIn || !checkOut) {
            Swal.fire({
                icon: "error",
                title: "Invalid Dates",
                text: "Please select both check-in and check-out dates",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        try {
            const res = await API.post("/room-booking/", {
                room: id,
                check_in: formatDate(checkIn),
                check_out: formatDate(checkOut),
            });

            if (res.data.Success) {
                Swal.fire({
                    icon: "success",
                    title: "Booking Requested!",
                    html: `
                        <div class="text-center">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCheckCircle class="text-green-500 text-3xl" />
                            </div>
                            <p>Your booking request was sent successfully.</p>
                            <p class="text-sm text-gray-600 mt-2">Waiting for admin approval.</p>
                        </div>
                    `,
                    confirmButtonColor: "#3085d6",
                });
                navigate('/my-bookings');
            } else {
                throw new Error(res.data.message || "Booking failed");
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Booking Failed",
                text: err.response?.data?.message || "Something went wrong. Please try again.",
                confirmButtonColor: "#d33",
            });
        }
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
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Room Not Found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <FiArrowLeft className="inline mr-1" />
                        Back to Rooms
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-6 text-white">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-white hover:text-blue-100 mb-4"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back
                        </button>
                        <div className="flex items-center">
                            <FiHome className="text-2xl mr-3" />
                            <h1 className="text-2xl font-bold">{room.name}</h1>
                        </div>
                        <div className="flex items-center mt-2">
                            <FiDollarSign className="mr-1" />
                            <span className="font-medium">₹{room.price} per night</span>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="p-6">
                        <form onSubmit={handleBooking} className="space-y-6">
                            {/* Check-in Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiCalendar className="inline mr-1" />
                                    Check-in Date
                                </label>
                                <DatePicker
                                    selected={checkIn}
                                    onChange={(date) => setCheckIn(date)}
                                    selectsStart
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={new Date()}
                                    filterDate={(date) => !isDateBooked(date)}
                                    dateFormat="MMMM d, yyyy"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholderText="Select check-in date"
                                    popperPlacement="bottom-start"
                                />
                            </div>

                            {/* Check-out Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiCalendar className="inline mr-1" />
                                    Check-out Date
                                </label>
                                <DatePicker
                                    selected={checkOut}
                                    onChange={(date) => setCheckOut(date)}
                                    selectsEnd
                                    startDate={checkIn}
                                    endDate={checkOut}
                                    minDate={checkIn || new Date()}
                                    filterDate={(date) => !isDateBooked(date)}
                                    dateFormat="MMMM d, yyyy"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholderText="Select check-out date"
                                    popperPlacement="bottom-start"
                                />
                            </div>

                            {/* Price Summary */}
                            {totalPrice !== null && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Price per night:</span>
                                        <span className="font-medium">₹{room.price}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Nights:</span>
                                        <span className="font-medium">{differenceInDays(checkOut, checkIn)}</span>
                                    </div>
                                    <div className="border-t border-blue-200 my-2"></div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span className="text-gray-800">Total:</span>
                                        <span className="text-blue-600">₹{totalPrice}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={totalPrice === null}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                                    totalPrice === null
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                                }`}
                            >
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomBooking;