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
  endUser?: string;
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
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-red-700">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Export CSV
            </button>
            <button
              onClick={() => setDeleteAllConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded"
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
          className="border p-2 w-full rounded"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="border px-2 py-1">S/N</th>
                <th className="border px-2 py-1">Engine Number</th>
                <th className="border px-2 py-1">Buyer</th>
                <th className="border px-2 py-1">Phone</th>
                <th className="border px-2 py-1">State</th>
                <th className="border px-2 py-1">Dealer</th>
                <th className="border px-2 py-1">Purchase Date</th>
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
                className={`px-3 py-1 rounded mx-1 ${
                  page === i + 1 ? "bg-red-600 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div>
            <label>Page Size:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="ml-2 border px-2 py-1"
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
                        handleEditChange(field as keyof Customer, e.target.value)
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
          <Modal message="Edit successful!" onClose={() => setEditSuccess(false)} />
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
          <Modal message="Customer deleted successfully." onClose={() => setDeleteSuccess(false)} />
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


// // pages/admin/index.tsx
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import AdminLayout from "@/components/AdminLayout";

// interface Customer {
//   _id: string;
//   engineNumber: string;
//   buyerName: string;
//   title: string;
//   phone: string;
//   state: string;
//   dealer: string;
//   purchaseDate: string;
//   endUser?: string;
//   model: string;
//   color: string;
// }

// export default function Admin() {
//   const router = useRouter();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterState, setFilterState] = useState("");
//   const [filterModel, setFilterModel] = useState("");
//   const [filterDealer, setFilterDealer] = useState("");
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [deleteEngineNumber, setDeleteEngineNumber] = useState("");
//   const [deleteBuyerName, setDeleteBuyerName] = useState("");
//   const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     const isAuth = localStorage.getItem("admin-auth");
//     if (isAuth !== "true") router.push("/admin/login");
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/registrations");
//         const data = await res.json();
//         setCustomers(data);
//       } catch (err) {
//         setError("Failed to fetch customers.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const filtered = customers.filter((c) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       (c.engineNumber.toLowerCase().includes(term) ||
//         c.buyerName.toLowerCase().includes(term) ||
//         c.phone.includes(term)) &&
//       (!filterState || c.state === filterState) &&
//       (!filterModel || c.model === filterModel) &&
//       (!filterDealer || c.dealer === filterDealer)
//     );
//   });

//   const totalPages = Math.ceil(filtered.length / pageSize);
//   const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

//   const handleEditChange = (field: keyof Customer, value: string) => {
//     if (editCustomer) setEditCustomer({ ...editCustomer, [field]: value });
//   };

//   const saveEdit = async () => {
//     if (!editCustomer) return;
//     const res = await fetch(`/api/update?id=${editCustomer._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(editCustomer),
//     });
//     if (res.ok) {
//       setCustomers((prev) =>
//         prev.map((c) => (c._id === editCustomer._id ? editCustomer : c))
//       );
//       setEditCustomer(null);
//     } else alert("Update failed");
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;
//     const res = await fetch(`/api/delete?id=${deleteId}`, { method: "DELETE" });
//     if (res.ok) {
//       setCustomers((prev) => prev.filter((c) => c._id !== deleteId));
//       setDeleteId(null);
//     } else alert("Delete failed");
//   };

//   const allStates = [...new Set(customers.map((c) => c.state))].sort();
//   const allModels = [...new Set(customers.map((c) => c.model))].sort();
//   const allDealers = [...new Set(customers.map((c) => c.dealer))].sort();

//   return (
//     <AdminLayout>
//       <div className="p-6 space-y-6">
//         <div className="flex flex-wrap justify-between items-center">
//           <h1 className="text-2xl font-bold text-red-700">Admin Dashboard</h1>
//           <button
//             onClick={() => {
//               const csv = [
//                 [
//                   "Engine Number",
//                   "Buyer",
//                   "Phone",
//                   "State",
//                   "Dealer",
//                   "Date",
//                   "Model",
//                   "Color",
//                   "End User",
//                 ],
//                 ...filtered.map((c) => [
//                   c.engineNumber,
//                   `${c.title} ${c.buyerName}`,
//                   c.phone,
//                   c.state,
//                   c.dealer,
//                   new Date(c.purchaseDate).toLocaleDateString(),
//                   c.model,
//                   c.color,
//                   c.endUser || "",
//                 ]),
//               ]
//                 .map((row) => row.map((v) => `"${v}"`).join(","))
//                 .join("\n");
//               const blob = new Blob([csv], { type: "text/csv" });
//               const url = URL.createObjectURL(blob);
//               const link = document.createElement("a");
//               link.href = url;
//               link.download = `customers_${Date.now()}.csv`;
//               link.click();
//             }}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Export to CSV
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="grid md:grid-cols-4 gap-4">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search By Engine NO, Buyer Name, dPhone, Dealer, State"
//             className="border p-2 rounded"
//           />
//           <select
//             value={filterState}
//             onChange={(e) => setFilterState(e.target.value)}
//             className="border p-2 rounded"
//           >
//             <option value="">All States</option>
//             {allStates.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//           <select
//             value={filterModel}
//             onChange={(e) => setFilterModel(e.target.value)}
//             className="border p-2 rounded"
//           >
//             <option value="">All Models</option>
//             {allModels.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//           </select>
//           <select
//             value={filterDealer}
//             onChange={(e) => setFilterDealer(e.target.value)}
//             className="border p-2 rounded"
//           >
//             <option value="">All Dealers</option>
//             {allDealers.map((d) => (
//               <option key={d} value={d}>
//                 {d}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-between items-center">
//           <div className="space-x-2">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   page === i + 1 ? "bg-red-600 text-white" : "bg-white"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//           <div>
//             <label className="mr-2 text-sm">Page Size:</label>
//             <select
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//               className="border px-2 py-1 rounded"
//             >
//               {[5, 10, 20, 50].map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead className="bg-red-600 text-white">
//               <tr>
//                 <th className="p-2">Engine</th>
//                 <th className="p-2">Buyer</th>
//                 <th className="p-2">Phone</th>
//                 <th className="p-2">State</th>
//                 <th className="p-2">Dealer</th>
//                 <th className="p-2">Date</th>
//                 <th className="p-2">Model</th>
//                 <th className="p-2">Color</th>
//                 <th className="p-2">Edit</th>
//                 <th className="p-2">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginated.map((c) => (
//                 <tr key={c._id} className="border-t">
//                   <td className="p-2">{c.engineNumber}</td>
//                   <td className="p-2">
//                     {c.title} {c.buyerName}
//                   </td>
//                   <td className="p-2">{c.phone}</td>
//                   <td className="p-2">{c.state}</td>
//                   <td className="p-2">{c.dealer}</td>
//                   <td className="p-2">
//                     {new Date(c.purchaseDate).toLocaleDateString()}
//                   </td>
//                   <td className="p-2">{c.model}</td>
//                   <td className="p-2">{c.color}</td>
//                   <td className="p-2">
//                     <button
//                       onClick={() => setEditCustomer(c)}
//                       className="text-blue-600"
//                     >
//                       ✏️
//                     </button>
//                   </td>
//                   <td className="p-2">
//                     <button
//                       onClick={() => {
//                         setDeleteId(c._id);
//                         setDeleteEngineNumber(c.engineNumber);
//                         setDeleteBuyerName(`${c.title} ${c.buyerName}`);
//                       }}
//                       className="text-red-600"
//                     >
//                       ✖
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Delete Modal */}
//         {deleteId && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg w-80">
//               <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
//               <p className="text-sm mb-4">
//                 Delete engine <b>{deleteEngineNumber}</b> for <b>{deleteBuyerName}</b>?
//               </p>
//               <div className="flex justify-between">
//                 <button
//                   onClick={handleDelete}
//                   className="bg-red-600 px-4 py-2 text-white rounded"
//                 >
//                   Yes
//                 </button>
//                 <button
//                   onClick={() => setDeleteId(null)}
//                   className="bg-gray-300 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {editCustomer && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg max-w-md w-full">
//               <h2 className="text-xl font-bold text-center mb-4">
//                 Edit Customer
//               </h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   value={editCustomer.buyerName}
//                   onChange={(e) => handleEditChange("buyerName", e.target.value)}
//                   className="border px-2 py-1 rounded"
//                   placeholder="Buyer Name"
//                 />
//                 <input
//                   value={editCustomer.phone}
//                   onChange={(e) => handleEditChange("phone", e.target.value)}
//                   className="border px-2 py-1 rounded"
//                   placeholder="Phone"
//                 />
//                 <input
//                   value={editCustomer.state}
//                   onChange={(e) => handleEditChange("state", e.target.value)}
//                   className="border px-2 py-1 rounded"
//                   placeholder="State"
//                 />
//                 <input
//                   value={editCustomer.dealer}
//                   onChange={(e) => handleEditChange("dealer", e.target.value)}
//                   className="border px-2 py-1 rounded"
//                   placeholder="Dealer"
//                 />
//                 <input
//                   value={editCustomer.model}
//                   onChange={(e) => handleEditChange("model", e.target.value)}
//                   className="border px-2 py-1 rounded"
//                   placeholder="Model"
//                 />
//                 <input
//                   value={editCustomer.color}
//                   onChange={(e) => handleEditChange("color", e.target.value)}
//                   className="border px-2 py-1 rounded"
//                   placeholder="Color"
//                 />
//               </div>
//               <div className="flex justify-center mt-4 space-x-4">
//                 <button
//                   onClick={saveEdit}
//                   className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setEditCustomer(null)}
//                   className="bg-gray-300 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
