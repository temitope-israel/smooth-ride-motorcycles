// pages/admin/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";

interface Customer {
  _id: string;
  engineNumber: string;
  buyerName: string;
  title: string;
  phone: string;
  state: string;
  dealer: string;
  purchaseDate: string;
  usage: string;
  endUser?: string;
  endUserPhone?: string;
  model: string;
  color: string;
}

export default function Admin() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deleteAllSuccess, setDeleteAllSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-auth");
    if (isAuth !== "true") router.push("/admin/login");
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((c) => {
      const term = search.toLowerCase();
      return (
        c.engineNumber.toLowerCase().includes(term) ||
        c.buyerName.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.dealer.toLowerCase().includes(term) ||
        c.state.toLowerCase().includes(term)
      );
    });
    setFilteredCustomers(filtered);
  }, [search, customers]);

  const fetchCustomers = async () => {
    const res = await fetch("/api/registrations");
    const data = await res.json();
    setCustomers(data);
  };

  const handleEditChange = (field: keyof Customer, value: string) => {
    if (editCustomer) {
      setEditCustomer({ ...editCustomer, [field]: value });
    }
  };

  const saveEdit = async () => {
    if (!editCustomer) return;
    const res = await fetch(`/api/update?id=${editCustomer._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCustomer),
    });
    if (res.ok) {
      await fetchCustomers();
      setEditCustomer(null);
      setEditSuccess(true);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/delete?id=${deleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchCustomers();
      setDeleteId(null);
      setDeleteSuccess(true);
    }
  };

  const handleDeleteAll = async () => {
    const res = await fetch("/api/admin/delete-all-customers", {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchCustomers();
      setDeleteAllConfirm(false);
      setDeleteAllSuccess(true);
    }
  };

  const paginated = filteredCustomers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const exportCSV = () => {
    const headers = [
      "S/N",
      "Engine Number",
      "Buyer",
      "Phone",
      "State",
      "Dealer",
      "Purchase Date",
      "Usage",
      "End-User",
      "End-User Phone",
      "Model",
      "Color",
    ];
    const rows = filteredCustomers.map((c, i) => [
      i + 1,
      c.engineNumber,
      `${c.title} ${c.buyerName}`,
      c.phone,
      c.state,
      c.dealer,
      new Date(c.purchaseDate).toLocaleDateString(),
      c.usage,
      c.endUser || "",
      c.endUserPhone || "",
      c.model,
      c.color,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  return (
    <AdminLayout>
      <div className="p-2 space-y-2 ">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-red-700">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded text-xs"
            >
              Export CSV
            </button>
            <button
              onClick={() => setDeleteAllConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded text-xs"
            >
              Delete All
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by engine number, buyer, phone, dealer, state"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full rounded text-sm"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse mt-6 border border-gray-400 text-[11.5px]">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="border px-2 py-1">S/N</th>
                <th className="border px-2 py-1">Engine Number</th>
                <th className="border px-2 py-1">Buyer</th>
                <th className="border px-2 py-1">Phone</th>
                <th className="border px-2 py-1">State</th>
                <th className="border px-2 py-1">Dealer</th>
                <th className="border px-2 py-1">Purchase Date</th>
                <th className="border px-2 py-1">Usage</th>
                <th className="border px-2 py-1">End-User</th>
                <th className="border px-2 py-1">End-User Phone</th>
                <th className="border px-2 py-1">Model</th>
                <th className="border px-2 py-1">Color</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <tr key={c._id}>
                  <td className="border px-2 py-1 text-center">
                    {(page - 1) * pageSize + i + 1}
                  </td>
                  <td className="border px-2 py-1">{c.engineNumber}</td>
                  <td className="border px-2 py-1">{`${c.title} ${c.buyerName}`}</td>
                  <td className="border px-2 py-1">{c.phone}</td>
                  <td className="border px-2 py-1">{c.state}</td>
                  <td className="border px-2 py-1">{c.dealer}</td>
                  <td className="border px-2 py-1">
                    {new Date(c.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1">{c.usage}</td>
                  <td className="border px-2 py-1">{c.endUser}</td>
                  <td className="border px-2 py-1">{c.endUserPhone}</td>
                  <td className="border px-2 py-1">{c.model}</td>
                  <td className="border px-2 py-1">{c.color}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => setEditCustomer(c)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(c._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded mx-1 text-sm ${
                  page === i + 1 ? "bg-red-600 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm">Page Size:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="ml-2 border px-2 py-1 text-xs"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modals */}
        {editCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
              <h2 className="text-lg font-bold mb-4 text-center">
                Edit Customer
              </h2>
              {["buyerName", "phone", "state", "dealer", "model", "color"].map(
                (field) => (
                  <div key={field} className="mb-3">
                    <label className="block text-sm capitalize">{field}</label>
                    <input
                      value={(editCustomer as any)[field]}
                      onChange={(e) =>
                        handleEditChange(
                          field as keyof Customer,
                          e.target.value
                        )
                      }
                      className="w-full border px-3 py-1 rounded"
                    />
                  </div>
                )
              )}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={saveEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCustomer(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {editSuccess && (
          <Modal
            message="Edit successful!"
            onClose={() => setEditSuccess(false)}
          />
        )}

        {deleteId && (
          <Modal
            message="Are you sure you want to delete this customer?"
            confirmText="Yes, Delete"
            onConfirm={handleDelete}
            onClose={() => setDeleteId(null)}
          />
        )}

        {deleteSuccess && (
          <Modal
            message="Customer deleted successfully."
            onClose={() => setDeleteSuccess(false)}
          />
        )}

        {deleteAllConfirm && (
          <Modal
            message="Are you sure you want to delete all customers?"
            confirmText="Yes, Delete All"
            onConfirm={handleDeleteAll}
            onClose={() => setDeleteAllConfirm(false)}
          />
        )}

        {deleteAllSuccess && (
          <Modal
            message="All customers deleted successfully."
            onClose={() => setDeleteAllSuccess(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function Modal({
  message,
  confirmText,
  onConfirm,
  onClose,
}: {
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          {confirmText && onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            {confirmText ? "Cancel" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
