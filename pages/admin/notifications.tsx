import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { Trash2, Bell, AlertTriangle, CheckCircle } from "lucide-react";

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
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/get-notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/admin/mark-all-notifications-read", { method: "PATCH" });
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
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
      setNotifications([]);
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    handleMarkAllRead();
  }, []);

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedData = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">

        {/* Header Area */}
        <div className="flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Bell className="text-indigo-600" /> Notifications
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              You have {notifications.filter(n => !n.read).length} unread alerts
            </p>
          </div>
          <button
            disabled={notifications.length === 0}
            className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50"
            onClick={() => setShowDeleteAllModal(true)}
          >
            Clear All
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Loading Alerts</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">All caught up!</h3>
              <p className="text-slate-500 text-sm">No new notifications at this time.</p>
            </div>
          ) : (
            <div className="p-2">
              <ul className="divide-y divide-slate-50">
                {paginatedData.map((notif) => (
                  <li
                    key={notif._id}
                    className="group flex items-start justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-slate-200' : 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)]'}`} />
                      <div>
                        <p className={`text-sm ${notif.read ? 'text-slate-500' : 'text-slate-800 font-semibold'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
                          {notif.createdAt && !isNaN(Date.parse(notif.createdAt))
                            ? new Date(notif.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
                            : "Recent"}
                        </p>
                      </div>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      onClick={() => {
                        setNotificationToDelete(notif._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-center gap-2 bg-slate-50/30">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      {(showDeleteModal || showDeleteAllModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-white animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              {showDeleteAllModal
                ? "This will permanently erase all notifications from the database."
                : "This notification will be removed forever."}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={showDeleteAllModal ? handleDeleteAll : handleDelete}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black tracking-widest transition-all shadow-lg shadow-rose-100"
              >
                {showDeleteAllModal ? "WIPE ALL" : "DELETE"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setShowDeleteAllModal(false);
                }}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black tracking-widest hover:bg-slate-200 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


// import AdminLayout from "@/components/AdminLayout";
// import { useEffect, useState } from "react";
// import { Trash2 } from "lucide-react";

// type Notification = {
//   _id: string;
//   message: string;
//   read: boolean;
//   createdAt: string;
// };

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
//   const [notificationToDelete, setNotificationToDelete] = useState<
//     string | null
//   >(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch("/api/admin/get-notifications");
//       const data = await res.json();
//       setNotifications(data.notifications);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAllRead = async () => {
//     await fetch("/api/admin/mark-all-notifications-read", { method: "PATCH" });
//     fetchNotifications();
//   };

//   const handleDelete = async () => {
//     if (!notificationToDelete) return;
//     try {
//       await fetch(`/api/admin/delete-notification?id=${notificationToDelete}`, {
//         method: "DELETE",
//       });
//       setShowDeleteModal(false);
//       fetchNotifications();
//     } catch (err) {
//       console.error("Failed to delete notification:", err);
//     }
//   };

//   const handleDeleteAll = async () => {
//     try {
//       await fetch("/api/admin/delete-all-notifications", { method: "DELETE" });
//       setShowDeleteAllModal(false);
//       fetchNotifications();
//     } catch (err) {
//       console.error("Failed to delete all notifications:", err);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     handleMarkAllRead(); // Optional: mark as read on load
//   }, []);

//   // Pagination logic
//   const totalPages = Math.ceil(notifications.length / itemsPerPage);
//   const paginatedData = notifications.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <AdminLayout>
//       <div className="p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-bold">Notifications</h1>
//           <button
//             className="text-red-600 text-sm"
//             onClick={() => setShowDeleteAllModal(true)}
//           >
//             Delete All
//           </button>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : paginatedData.length === 0 ? (
//           <p>No notifications yet.</p>
//         ) : (
//           <ul className="space-y-2">
//             {paginatedData.map((notif) => (
//               <li
//                 key={notif._id}
//                 className="bg-white shadow-sm p-3 rounded text-sm relative"
//               >
//                 <div className="flex justify-between">
//                   <span>{notif.message}</span>
//                   <button
//                     className="text-red-500 hover:text-red-700"
//                     onClick={() => {
//                       setNotificationToDelete(notif._id);
//                       setShowDeleteModal(true);
//                     }}
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//                 <div className="text-xs text-gray-400 mt-1">
//                   {notif.createdAt && !isNaN(Date.parse(notif.createdAt))
//                     ? new Date(notif.createdAt).toLocaleString()
//                     : "Invalid date"}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* Pagination controls */}
//         {totalPages > 1 && (
//           <div className="mt-4 flex justify-center gap-2">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 text-sm rounded ${
//                   currentPage === i + 1
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Individual delete modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-md">
//             <p>Are you sure you want to delete this notification?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 className="px-4 py-1 text-sm bg-gray-300 rounded"
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-1 text-sm bg-red-600 text-white rounded"
//                 onClick={handleDelete}
//               >
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete All modal */}
//       {showDeleteAllModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-md">
//             <p>
//               Are you sure you want to delete <strong>all</strong>{" "}
//               notifications?
//             </p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 className="px-4 py-1 text-sm bg-gray-300 rounded"
//                 onClick={() => setShowDeleteAllModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-1 text-sm bg-red-600 text-white rounded"
//                 onClick={handleDeleteAll}
//               >
//                 Yes, Delete All
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </AdminLayout>
//   );
// }
