
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import { 
  FiHome, 
  FiUser, 
  FiUsers, 
  FiCheckCircle, 
  FiClock,
  FiAlertCircle,
  FiPlus,
  FiAlertTriangle,
  FiSettings
} from "react-icons/fi";
import DashboardCard from "../../../components/dashboard";
import AdminChart from "../../../components/chart";

const AdminRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [rejectedBookings, setRejectedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [
          roomsRes,
          staffRes,
          usersRes,
          approvedRes,
          rejectedRes,
          pendingRes
        ] = await Promise.all([
          API.get("rooms/"),
          API.get("staff_create/"),
          API.get("admin/users/"),
          API.get("/approved-bookings/"),
          API.get("/rejected-bookings/"),
          API.get("/booking-requests/")
        ]);

        setRooms(roomsRes.data);
        setStaff(staffRes.data.data || []);
        setUsers(usersRes.data.data || []);
        setApprovedBookings(approvedRes.data.data || []);
        setRejectedBookings(rejectedRes.data || []);
        setPendingBookings(pendingRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;
  const bookedRooms = rooms.filter((r) => r.status === "booked").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your hotel management system</p>
        </div>

        <AdminChart />
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard 
            title="Total Rooms" 
            value={totalRooms} 
            icon={<FiHome className="text-blue-500" />}
            color="bg-blue-50"
          />
          <DashboardCard 
            title="Available Rooms" 
            value={availableRooms} 
            icon={<FiCheckCircle className="text-green-500" />}
            color="bg-green-50"
          />
          <DashboardCard 
            title="Maintenance" 
            value={maintenanceRooms} 
            icon={<FiSettings className="text-yellow-500" />}
            color="bg-yellow-50"
          />
          <DashboardCard 
            title="Not Available"
            value={bookedRooms}
            icon={<FiClock className="text-red-500" />}
            color="bg-red-50"
          />
          <DashboardCard 
            title="Total Staff" 
            value={staff.length} 
            onClick={() => navigate("/stafflist")}
            icon={<FiUser className="text-indigo-500" />}
            color="bg-indigo-50"
          />
          <DashboardCard 
            title="Total Users" 
            value={users.length} 
            onClick={() => navigate("/userlist")}
            icon={<FiUsers className="text-purple-500" />}
            color="bg-purple-50"
          />
          <DashboardCard 
            title="Approved Bookings" 
            value={approvedBookings.length} 
            onClick={() => navigate("/approved-bookings")}
            icon={<FiCheckCircle className="text-green-500" />}
            color="bg-green-50"
          />
          <DashboardCard 
            title="Pending Bookings" 
            value={pendingBookings.length} 
            onClick={() => navigate("/admin/bookings")}
            icon={<FiClock className="text-blue-500" />}
            color="bg-blue-50"
          />
          <DashboardCard 
            title="Rejected Bookings" 
            value={rejectedBookings.length} 
            onClick={() => navigate("/rejected-bookings")}
            icon={<FiAlertCircle className="text-red-500" />}
            color="bg-red-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => navigate("/room-create")}
            className="flex items-center bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition"
          >
            <FiPlus className="mr-2" />
            Add Room
          </button>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="flex items-center bg-white border border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-50 transition"
          >
            <FiClock className="mr-2" />
            Booking Requests
          </button>
          <button
            onClick={() => navigate("/admin-complaints")}
            className="flex items-center bg-white border border-red-500 text-red-600 px-4 py-2 rounded-lg shadow-sm hover:bg-red-50 transition"
          >
            <FiAlertTriangle className="mr-2" />
            View Complaints
          </button>
        </div>

        {/* Rooms Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Rooms Management</h2>
          </div>
          
          {rooms.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiHome className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No rooms available</h3>
              <p className="text-gray-500">Add your first room to get started</p>
              <button
                onClick={() => navigate("/room-create")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Room
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  {room.cover_image && (
                    <div className="relative h-48 w-full">
                      <img
                        src={room.cover_image}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Room+Image";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          room.status === "available"
                            ? "bg-green-100 text-green-800"
                            : room.status === "booked"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {room.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FiHome className="mr-1 text-gray-400" />
                        {room.room_number}
                      </span>
                      <span className="flex items-center">
                        <FiSettings className="mr-1 text-gray-400" />
                        {room.room_type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      ₹{room.price} <span className="text-gray-500 font-normal">/ night</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoomList;