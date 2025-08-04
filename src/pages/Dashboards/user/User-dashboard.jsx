
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

const UserDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/rooms/");
      if (Array.isArray(res.data)) {
        setRooms(res.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesCategory =
      selectedCategory === "" || room.category === selectedCategory;
    const matchesType =
      selectedType === "" || room.room_type === selectedType;
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Find Your Perfect Stay
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our collection of premium rooms and suites tailored
            for your comfort
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="ac">AC (Air Conditioned)</option>
                <option value="non_ac">Non-AC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedType("");
                setSearchTerm("");
              }}
              className="h-10 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Room Cards or Empty Message */}
        {!isLoading && filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No rooms found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
                    <h2 className="text-xl font-bold text-white">{room.name}</h2>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {room.room_type}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                          room.category === "ac"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {room.category === "ac" ? "Air Conditioned" : "Non-AC"}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                        room.status
                      )}`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-gray-500 text-sm">Starting from</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{room.price}
                        <span className="text-sm font-normal text-gray-500">
                          /night
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/room/${room.id}`);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-200"
                    >
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
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

export default UserDashboard;