
import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { 
  FiBell, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo,
  FiClock,
  FiTrash2
} from "react-icons/fi";
import { formatDistanceToNow } from 'date-fns';

const StaffNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        await API.post('/notifications/mark-read/');
        const response = await API.get("/notifications/");
        if (response.data.Success) {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error("Notification error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);



  const getNotificationIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'alert':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
            <FiBell className="text-blue-600 text-2xl mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiBell className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`px-6 py-4 flex items-start ${!notification.is_read ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className="flex-shrink-0 mt-1 mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <FiClock className="mr-1" />
                      <span>
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 text-right">
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffNotification;