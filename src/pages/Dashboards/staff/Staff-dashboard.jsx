
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import API from '../../../api/api';
import { 
  FiHome, 
  FiPlus, 
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';

const StaffDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("rooms/");
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case "available":
        return <FiCheckCircle className="text-green-500 mr-1" />;
      case "booked":
        return <FiClock className="text-yellow-500 mr-1" />;
      default:
        return <FiXCircle className="text-red-500 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FiHome className="text-2xl text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Staff Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/staff-booking')}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              <FiPlus className="mr-2" />
              New Booking
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiHome className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Rooms Available</h3>
            <p className="text-gray-500 mb-4">There are currently no rooms in the system</p>
            <button
              onClick={() => navigate('/staff-booking')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Create Booking
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/staff/rooms/${room.id}`)}
              >
                <div className="relative h-48 w-full">
                  <img
                    src={room.cover_image || "https://via.placeholder.com/400x300?text=Room+Image"}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Room+Image";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-xl font-semibold text-white">{room.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Room No:</span> {room.room_number}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Type:</span> {room.room_type}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full flex items-center ${
                      room.status === "available"
                        ? "bg-green-100 text-green-800"
                        : room.status === "booked"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {getStatusIcon(room.status)}
                      {room.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-800 font-medium">
                      ₹{room.price} <span className="text-gray-500 text-sm">/ night</span>
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/staff-booking', { state: { roomId: room.id } });
                      }}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
