// pages/admin/view-admins.tsx
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { Trash2, KeyRound, Copy, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";

type Admin = {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [passwordModal, setPasswordModal] = useState<{ show: boolean; password: string }>({
    show: false,
    password: "",
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/view-admins");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to sync directory");
      setAdmins(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      const res = await fetch(`/api/admin/delete-admin/${adminToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete operation failed");
      setAdmins((prev) => prev.filter((a) => a._id !== adminToDelete._id));
      setAdminToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const regeneratePassword = async (id: string) => {
    try {
      const res = await fetch("/api/admin/regenerate-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPasswordModal({ show: true, password: data.generatedPassword });
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50/50 p-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Directory</h1>
            <p className="text-slate-500 font-medium">Manage team access and security credentials</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600">
            Total Admins: <span className="text-indigo-600">{admins.length}</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2">
            <AlertCircle size={18} /> {error}
            <button onClick={() => setError("")} className="ml-auto text-rose-400 hover:text-rose-600"><X size={16}/></button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Fetching Personnel...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Security Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {admins.map((a) => (
                  <tr key={a._id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                          {getInitials(a.fullName)}
                        </div>
                        <span className="font-bold text-slate-700">{a.fullName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-medium text-slate-500">{a.email}</td>
                    <td className="px-8 py-5 font-medium text-slate-400 text-sm">
                      {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => regeneratePassword(a._id)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          title="Reset Password"
                        >
                          <KeyRound size={18} />
                        </button>
                        <button
                          onClick={() => setAdminToDelete(a)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Revoke Access"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {adminToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Revoke Access?</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  You are about to remove <strong>{adminToDelete.fullName}</strong>. They will immediately lose all administrative privileges.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={deleteAdmin}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-rose-200"
                >
                  Confirm Deletion
                </button>
                <button
                  onClick={() => setAdminToDelete(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-black transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Reset Success Modal */}
        {passwordModal.show && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">New Credentials Generated</h3>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between group">
                <code className="text-lg font-black text-indigo-600 tracking-wider">
                  {passwordModal.password}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(passwordModal.password);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`p-2 rounded-xl transition-all ${copied ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-400 hover:text-indigo-600"}`}
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <button
                onClick={() => setPasswordModal({ show: false, password: "" })}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// import AdminLayout from "@/components/AdminLayout";
// import { useEffect, useState } from "react";
// import { Trash2, KeyRound, ClipboardCopy } from "lucide-react";

// type Admin = {
//   _id: string;
//   fullName: string;
//   email: string;
//   createdAt: string;
// };

// export default function AdminList() {
//   const [admins, setAdmins] = useState<Admin[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [deletionMessage, setDeletionMessage] = useState("");
//   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
//   const [passwordModal, setPasswordModal] = useState<{
//     show: boolean;
//     password: string;
//   }>({
//     show: false,
//     password: "",
//   });

//   const fetchAdmins = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/admin/view-admins");
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch admins");
//       setAdmins(data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAdmin = async () => {
//     if (!adminToDelete) return;

//     try {
//       const res = await fetch(`/api/admin/delete-admin/${adminToDelete._id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Delete failed");

//       setAdmins((prev) => prev.filter((a) => a._id !== adminToDelete._id));
//       setDeletionMessage("✅ Admin deleted successfully.");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setAdminToDelete(null);
//     }
//   };

//   const regeneratePassword = async (id: string) => {
//     try {
//       const res = await fetch("/api/admin/regenerate-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setPasswordModal({ show: true, password: data.generatedPassword });
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   return (
//     <AdminLayout>
//       <div className="min-h-screen bg-indigo-50 p-6">
//         <h2 className="text-2xl font-bold text-Indigo-700 mb-6">Admin List</h2>

//         {error && (
//           <p className="bg-red-100 border border-red-500 text-red-800 p-2 mb-4 rounded text-xs">
//             {error}
//           </p>
//         )}
//         {deletionMessage && (
//           <div className="bg-green-100 border border-green-500 text-green-800 px-4 py-2 rounded mb-4 text-xs">
//             {deletionMessage}
//           </div>
//         )}

//         {loading ? (
//           <p>Loading admins...</p>
//         ) : admins.length === 0 ? (
//           <p>No admins found.</p>
//         ) : (
//           <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white text-xs">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-indigo-100 text-gray-700">
//                 <tr>
//                   <th className=" font-bold px-6 py-3 text-left">Name</th>
//                   <th className=" font-bold px-6 py-3 text-left ">Email</th>
//                   <th className=" font-bold px-6 py-3 text-left ">Created</th>
//                   <th className=" font-bold px-6 py-3 text-left ">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {admins.map((a) => (
//                   <tr key={a._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-3">{a.fullName}</td>
//                     <td className="px-6 py-3">{a.email}</td>
//                     <td className="px-6 py-3">
//                       {new Date(a.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-3 flex gap-6">
//                       <button
//                         onClick={() => regeneratePassword(a._id)}
//                         className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
//                         title="Regenerate Password"
//                       >
//                         <KeyRound size={16} /> Reset
//                       </button>
//                       <button
//                         onClick={() => setAdminToDelete(a)}
//                         className="text-red-600 hover:text-red-800 flex items-center gap-1"
//                         title="Delete Admin"
//                       >
//                         <Trash2 size={16} /> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {adminToDelete && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center text-xs">
//               <h2 className=" font-semibold text-red-700 mb-4">
//                 Confirm Deletion
//               </h2>
//               <p className="mb-6 text-gray-700">
//                 Are you sure you want to delete{" "}
//                 <strong>{adminToDelete.fullName}</strong>?
//               </p>

//               <div className="flex justify-center gap-4">
//                 <button
//                   onClick={deleteAdmin}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//                 >
//                   Yes, Delete
//                 </button>
//                 <button
//                   onClick={() => setAdminToDelete(null)}
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Password Modal */}
//         {passwordModal.show && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-center">
//               <h2 className="text-lg font-semibold text-green-700 mb-2">
//                 New Password Generated
//               </h2>
//               <p className="text-sm mb-4 text-gray-700">
//                 Copy and share the password securely with the admin.
//               </p>
//               <div className="flex justify-center items-center gap-2 mb-4">
//                 <code className="bg-gray-100 border px-3 py-1 rounded text-sm">
//                   {passwordModal.password}
//                 </code>
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(passwordModal.password);
//                   }}
//                   className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex items-center gap-1"
//                 >
//                   <ClipboardCopy size={14} /> Copy
//                 </button>
//               </div>
//               <button
//                 onClick={() => setPasswordModal({ show: false, password: "" })}
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
