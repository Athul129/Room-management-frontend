
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { 
  FaBell, 
  FaRegBell, 
  FaCheck, 
  FaTrashAlt,
  FaRegCheckCircle,
  FaSearch,
  FaSync
} from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      await API.post('/notifications/mark-read/');
      const response = await API.get("/notifications/");
      if (response.data.Success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Notification error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load notifications. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/mark-read/`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };


  const filteredNotifications = notifications
    .filter(n => n.message.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(n => showUnreadOnly ? !n.is_read : true);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaBell className="mr-3" />
              Notifications
            </h2>
            <button
              onClick={fetchNotifications}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center transition-all"
            >
              <FaSync className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notifications..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                showUnreadOnly
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {showUnreadOnly ? (
                <>
                  <FaRegBell className="mr-2" />
                  Show All
                </>
              ) : (
                <>
                  <FaBell className="mr-2" />
                  Show Unread Only
                </>
              )}
            </button>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <FaRegBell className="mx-auto text-4xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                {showUnreadOnly ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-gray-500 mt-1">
                {showUnreadOnly
                  ? "You're all caught up!"
                  : "Your notifications will appear here."}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredNotifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-5 rounded-xl shadow-sm transition-all ${
                    n.is_read
                      ? "bg-white border border-gray-100"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {n.is_read ? (
                          <FaRegCheckCircle className="text-gray-400 mr-3" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                        )}
                        <p
                          className={`${
                            n.is_read ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          {n.message}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 ml-8 mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-2">
                      {!n.is_read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Mark as read"
                        >
                          <FaCheck />
                        </button>
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

export default AdminNotification;