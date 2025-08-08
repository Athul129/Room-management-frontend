
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { 
  FaBell, 
  FaRegBell, 
  FaRegCheckCircle, 
  FaTrashAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotifications, setExpandedNotifications] = useState({});
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Mark all as read first (optional order)
        await API.post("/notifications/mark-read/");

        // Then fetch notifications
        const response = await API.get("/notifications/");
        if (response.data.Success) {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error("Notification error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const toggleNotification = (id) => {
    setExpandedNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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


  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.is_read)
    : notifications;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FaBell className="mr-3 text-blue-600" />
          Your Notifications
        </h2>
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
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl shadow-sm transition-all ${
                n.is_read
                  ? "bg-white border border-gray-100"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    {n.is_read ? (
                      <FaRegCheckCircle className="text-gray-400 mr-2" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    )}
                    <p
                      className={`font-medium ${
                        n.is_read ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {n.message}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 ml-4 mt-1">
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
                      <FaRegCheckCircle />
                    </button>
                  )}
                  <button
                    onClick={() => toggleNotification(n.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedNotifications[n.id] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>
              
              {expandedNotifications[n.id] && (
                <div className="mt-3 pl-6 pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <p>Created: {new Date(n.created_at).toLocaleString()}</p>
                    {n.metadata && (
                      <div className="mt-2">
                        <p className="font-medium">Details:</p>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(n.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNotifications;