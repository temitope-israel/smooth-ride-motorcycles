import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { Trash2, KeyRound, ClipboardCopy } from "lucide-react";

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
  const [deletionMessage, setDeletionMessage] = useState("");
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [passwordModal, setPasswordModal] = useState<{ show: boolean; password: string }>({
    show: false,
    password: "",
  });

  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/view-admins");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch admins");
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
      const res = await fetch(`/api/admin/delete-admin/${adminToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setAdmins((prev) => prev.filter((a) => a._id !== adminToDelete._id));
      setDeletionMessage("✅ Admin deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setAdminToDelete(null);
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

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-red-50 p-6">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Admin List</h2>

        {error && (
          <p className="bg-red-100 border border-red-500 text-red-800 p-2 mb-4 rounded text-xs">
            {error}
          </p>
        )}
        {deletionMessage && (
          <div className="bg-green-100 border border-green-500 text-green-800 px-4 py-2 rounded mb-4 text-xs">
            {deletionMessage}
          </div>
        )}

        {loading ? (
          <p>Loading admins...</p>
        ) : admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white text-xs">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-100 text-gray-700">
                <tr>
                  <th className=" font-bold px-6 py-3 text-left">Name</th>
                  <th className=" font-bold px-6 py-3 text-left ">Email</th>
                  <th className=" font-bold px-6 py-3 text-left ">Created</th>
                  <th className=" font-bold px-6 py-3 text-left ">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{a.fullName}</td>
                    <td className="px-6 py-3">{a.email}</td>
                    <td className="px-6 py-3">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 flex gap-6">
                      <button
                        onClick={() => regeneratePassword(a._id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Regenerate Password"
                      >
                        <KeyRound size={16} /> Reset
                      </button>
                      <button
                        onClick={() => setAdminToDelete(a)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        title="Delete Admin"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {adminToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center text-xs">
              <h2 className=" font-semibold text-red-700 mb-4">
                Confirm Deletion
              </h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete <strong>{adminToDelete.fullName}</strong>?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={deleteAdmin}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setAdminToDelete(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {passwordModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-center">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                New Password Generated
              </h2>
              <p className="text-sm mb-4 text-gray-700">
                Copy and share the password securely with the admin.
              </p>
              <div className="flex justify-center items-center gap-2 mb-4">
                <code className="bg-gray-100 border px-3 py-1 rounded text-sm">
                  {passwordModal.password}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(passwordModal.password);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex items-center gap-1"
                >
                  <ClipboardCopy size={14} /> Copy
                </button>
              </div>
              <button
                onClick={() => setPasswordModal({ show: false, password: "" })}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
