// pages/admin/notifications.tsx

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";

interface Notification {
  message: string;
  timestamp: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded shadow text-sm border border-gray-200"
              >
                <p>{notif.message}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}
