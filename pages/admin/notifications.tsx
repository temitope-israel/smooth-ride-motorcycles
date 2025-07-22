import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Notification = {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/get-notifications");
      const data = await res.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    await fetch("/api/admin/mark-all-notifications-read", { method: "PATCH" });
    fetchNotifications();
  };

  const handleDelete = async () => {
    if (!notificationToDelete) return;
    try {
      await fetch(`/api/admin/delete-notification?id=${notificationToDelete}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await fetch("/api/admin/delete-all-notifications", { method: "DELETE" });
      setShowDeleteAllModal(false);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    handleMarkAllRead(); // Optional: mark as read on load
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedData = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Notifications</h1>
          <button
            className="text-red-600 text-sm"
            onClick={() => setShowDeleteAllModal(true)}
          >
            Delete All
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : paginatedData.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul className="space-y-2">
            {paginatedData.map((notif) => (
              <li
                key={notif._id}
                className="bg-white shadow-sm p-3 rounded text-sm relative"
              >
                <div className="flex justify-between">
                  <span>{notif.message}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setNotificationToDelete(notif._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {notif.createdAt && !isNaN(Date.parse(notif.createdAt))
                    ? new Date(notif.createdAt).toLocaleString()
                    : "Invalid date"}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Individual delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p>Are you sure you want to delete this notification?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-1 text-sm bg-gray-300 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 text-sm bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p>
              Are you sure you want to delete <strong>all</strong>{" "}
              notifications?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-1 text-sm bg-gray-300 rounded"
                onClick={() => setShowDeleteAllModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 text-sm bg-red-600 text-white rounded"
                onClick={handleDeleteAll}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
