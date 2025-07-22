import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { Trash2, PencilLine, Download } from "lucide-react";

type Dealer = {
  _id: string;
  status: string;
  pic: string;
  dlrName: string;
  region: string;
  state: string;
  town: string;
  address: string;
  phone1: string;
  phone2?: string;
  ownerOrContactPerson: string;
  createdAt: string;
};

export default function ViewDealers() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dealerToDelete, setDealerToDelete] = useState<Dealer | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteSuccess, setBulkDeleteSuccess] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState(false);
  const [editDealer, setEditDealer] = useState<Dealer | null>(null);
  const [editedData, setEditedData] = useState<Partial<Dealer>>({});
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/view-dealers?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );

      const data = await res.json();
      setDealers(data.dealers || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch dealers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  useEffect(() => {
    const fetchDealers = async () => {
      const res = await fetch("/api/dealers");
      const data = await res.json();
      setDealers(data); // no pagination here
    };

    fetchDealers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/delete-dealer/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setDealerToDelete(null);
      setDeleteSuccess(true);
      fetchDealers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const res = await fetch("/api/admin/delete-all-dealers", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Bulk delete failed");
      setShowBulkDeleteModal(false);
      setBulkDeleteSuccess(true);
      fetchDealers();
    } catch (err) {
      setShowBulkDeleteModal(false);
      setBulkDeleteError(true);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "S/N",
      "Status",
      "PIC",
      "Dealer Name",
      "Region",
      "State",
      "Town",
      "Address",
      "Phone 1",
      "Phone 2",
      "Owner/Contact Person",
    ];

    const rows = dealers.map((d, i) => [
      i + 1,
      d.status,
      d.pic,
      d.dlrName,
      d.region,
      d.state,
      d.town,
      d.address,
      d.phone1,
      d.phone2 || "",
      d.ownerOrContactPerson || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dealers.csv";
    a.click();
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch("/api/admin/update-dealer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editDealer?._id,
          updatedData: editedData,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      setEditDealer(null);
      setEditedData({});
      setEditSuccess(true);
      fetchDealers();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen bg-red-50 text-xs">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-red-700">View Dealers</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search dealers..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border px-3 py-2 rounded w-full sm:w-64"
            />
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-xs"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={() => setShowBulkDeleteModal(true)}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-xs"
            >
              Delete All Dealers
            </button>
          </div>
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(parseInt(e.target.value));
            setCurrentPage(1); // reset to first page
          }}
          className="border px-3 py-2 rounded text-xs"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              Show {num}
            </option>
          ))}
        </select>
        {loading ? (
          <p>Loading dealers...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow border mt-10">
            <table className="min-w-full divide-y divide-gray-200 text-[10px]">
              <thead className="bg-red-100 text-left">
                <tr>
                  {[
                    "S/N",
                    "Status",
                    "PIC",
                    "Dealer Name",
                    "Region",
                    "State",
                    "Town",
                    "Address",
                    "Phone 1",
                    "Phone 2",
                    "Owner/Contact",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-4 py-2 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {dealers.map((d, i) => (
                  <tr key={d._id}>
                    <td className="px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    <td className="border px-4 py-2">{d.status}</td>
                    <td className="border px-4 py-2">{d.pic}</td>
                    <td className="border px-4 py-2">{d.dlrName}</td>
                    <td className="border px-4 py-2">{d.region}</td>
                    <td className="border px-4 py-2">{d.state}</td>
                    <td className="border px-4 py-2">{d.town}</td>
                    <td className="border px-4 py-2">{d.address}</td>
                    <td className="border px-4 py-2">{d.phone1}</td>
                    <td className="border px-4 py-2">{d.phone2}</td>
                    <td className="border px-4 py-2">
                      {d.ownerOrContactPerson}
                    </td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditDealer(d);
                          setEditedData(d);
                        }}
                        className="text-blue-600"
                      >
                        <PencilLine size={16} />
                      </button>
                      <button
                        onClick={() => setDealerToDelete(d)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* ✅ Pagination (based on totalCount) */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
        {/* ✅ Other modals (edit, delete, success, etc.) remain unchanged */}
        {/* ... keep your modals for edit/save/delete/etc. here ... */}
        {/* Edit Modal */}
        {editDealer && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-lg font-semibold mb-4 text-red-700">
                Edit Dealer
              </h2>
              {[
                "status",
                "pic",
                "dlrName",
                "region",
                "state",
                "town",
                "address",
                "phone1",
                "phone2",
                "ownerOrContactPerson",
              ].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={editedData[field as keyof Dealer] || ""}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  className="mb-2 border px-3 py-2 w-full rounded"
                />
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleEditSave}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditDealer(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation */}
        {dealerToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
              <p className="text-red-700 font-semibold mb-2">Confirm Delete</p>
              <p>
                Delete dealer <strong>{dealerToDelete.dlrName}</strong>?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => handleDelete(dealerToDelete._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDealerToDelete(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Bulk Delete Confirmation */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
              <p className="text-red-700 font-semibold mb-2">
                Delete All Dealers?
              </p>
              <p>This action cannot be undone.</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modals for Success */}
        {editSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
              <p className="text-green-700 font-semibold mb-4">
                Dealer updated successfully!
              </p>
              <button
                onClick={() => setEditSuccess(false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {deleteSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
              <p className="text-green-700 font-semibold mb-4">
                Dealer deleted successfully!
              </p>
              <button
                onClick={() => setDeleteSuccess(false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {bulkDeleteSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
              <p className="text-green-700 font-semibold mb-4">
                All dealers deleted successfully!
              </p>
              <button
                onClick={() => setBulkDeleteSuccess(false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {bulkDeleteError && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
              <p className="text-red-700 font-semibold mb-4">
                Failed to delete all dealers.
              </p>
              <button
                onClick={() => setBulkDeleteError(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
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

// import AdminLayout from "@/components/AdminLayout";
// import { useEffect, useState } from "react";
// import { Trash2, PencilLine, Download } from "lucide-react";

// type Dealer = {
//   _id: string;
//   status: string;
//   pic: string;
//   dlrName: string;
//   region: string;
//   state: string;
//   town: string;
//   address: string;
//   phone1: string;
//   phone2?: string;
//   ownerOrContactPerson: string;
//   createdAt: string;
// };

// export default function ViewDealers() {
//   const [dealers, setDealers] = useState<Dealer[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [dealerToDelete, setDealerToDelete] = useState<Dealer | null>(null);
//   const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
//   const [bulkDeleteSuccess, setBulkDeleteSuccess] = useState(false);
//   const [bulkDeleteError, setBulkDeleteError] = useState(false);
//   const [editDealer, setEditDealer] = useState<Dealer | null>(null);
//   const [editedData, setEditedData] = useState<Partial<Dealer>>({});
//   const [editSuccess, setEditSuccess] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchDealers = async () => {
//     setLoading(true);
//     try {
//       //const res = await fetch("/api/admin/view-dealers");
//       const res = await fetch(
//         `/api/admin/view-dealers?page=${currentPage}&limit=${itemsPerPage}`
//       );

//       const data = await res.json();
//       setDealers(data.dealers || []);
//     } catch (err) {
//       console.error("Failed to fetch dealers:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDealers();
//   }, []);

//   const filteredDealers = dealers.filter((d) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       d.dlrName?.toLowerCase().includes(term) ||
//       d.state?.toLowerCase().includes(term) ||
//       d.region?.toLowerCase().includes(term) ||
//       d.town?.toLowerCase().includes(term) ||
//       d.pic?.toLowerCase().includes(term) ||
//       d.ownerOrContactPerson?.toLowerCase().includes(term)
//     );
//   });

//   const paginatedDealers = filteredDealers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleDelete = async (id: string) => {
//     try {
//       const res = await fetch(`/api/admin/delete-dealer/${id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       if (!res.ok) throw new Error("Failed to delete");
//       setDealerToDelete(null);
//       setDeleteSuccess(true);
//       fetchDealers();
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   const handleBulkDelete = async () => {
//     try {
//       const res = await fetch("/api/admin/delete-all-dealers", {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Bulk delete failed");
//       setShowBulkDeleteModal(false);
//       setBulkDeleteSuccess(true);
//       fetchDealers();
//     } catch (err) {
//       setShowBulkDeleteModal(false);
//       setBulkDeleteError(true);
//     }
//   };

//   const exportToCSV = () => {
//     const headers = [
//       "S/N",
//       "Status",
//       "PIC",
//       "Dealer Name",
//       "Region",
//       "State",
//       "Town",
//       "Address",
//       "Phone 1",
//       "Phone 2",
//       "Owner/Contact Person",
//     ];
//     const rows = filteredDealers.map((d, i) => [
//       i + 1,
//       d.status,
//       d.pic,
//       d.dlrName,
//       d.region,
//       d.state,
//       d.town,
//       d.address,
//       d.phone1,
//       d.phone2 || "",
//       d.ownerOrContactPerson,
//     ]);
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows].map((e) => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "dealers.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleEditSave = async () => {
//     try {
//       const res = await fetch("/api/admin/update-dealer", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: editDealer?._id,
//           updatedData: editedData,
//         }),
//       });
//       if (!res.ok) throw new Error("Update failed");
//       setEditDealer(null);
//       setEditedData({});
//       setEditSuccess(true);
//       fetchDealers();
//     } catch (err) {
//       console.error("Update error:", err);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 min-h-screen bg-red-50 text-xs">
//         <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center mb-4">
//           <h2 className="text-2xl font-bold text-red-700">View Dealers</h2>
//           <div className="flex gap-2 flex-wrap">
//             <input
//               type="text"
//               placeholder="Search dealers..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="border px-3 py-2 rounded w-full sm:w-64"
//             />
//             <button
//               onClick={exportToCSV}
//               className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-xs"
//             >
//               <Download size={16} /> Export CSV
//             </button>
//             <button
//               onClick={() => setShowBulkDeleteModal(true)}
//               className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-xs]"
//             >
//               Delete All Dealers
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <p>Loading dealers...</p>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded shadow border mt-10">
//             <table className="min-w-full divide-y divide-gray-200 text-[10px]">
//               <thead className="bg-red-100 text-left">
//                 <tr>
//                   {[
//                     "S/N",
//                     "Status",
//                     "PIC",
//                     "Dealer Name",
//                     "Region",
//                     "State",
//                     "Town",
//                     "Address",
//                     "Phone 1",
//                     "Phone 2",
//                     "Owner/Contact",
//                     "Actions",
//                   ].map((h) => (
//                     <th key={h} className="px-4 py-2 font-bold">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {paginatedDealers.map((d, i) => (
//                   <tr key={d._id}>
//                     <td className="px-4 py-2">
//                       {(currentPage - 1) * itemsPerPage + i + 1}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.status}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.pic}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.dlrName}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.region}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.state}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.town}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.address}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.phone1}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.phone2}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {d.ownerOrContactPerson}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 flex gap-2">
//                       <button
//                         onClick={() => {
//                           setEditDealer(d);
//                           setEditedData(d);
//                         }}
//                         className="text-blue-600"
//                       >
//                         <PencilLine size={16} />
//                       </button>
//                       <button
//                         onClick={() => setDealerToDelete(d)}
//                         className="text-red-600"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         <div className="flex justify-center gap-2 mt-4 flex-wrap">
//           {Array.from({
//             length: Math.ceil(filteredDealers.length / itemsPerPage),
//           }).map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === i + 1
//                   ? "bg-red-600 text-white"
//                   : "bg-gray-200 text-gray-800"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>

//         {/* Edit Modal */}
//         {editDealer && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg max-w-lg w-full">
//               <h2 className="text-lg font-semibold mb-4 text-red-700">
//                 Edit Dealer
//               </h2>
//               {[
//                 "status",
//                 "pic",
//                 "dlrName",
//                 "region",
//                 "state",
//                 "town",
//                 "address",
//                 "phone1",
//                 "phone2",
//                 "ownerOrContactPerson",
//               ].map((field) => (
//                 <input
//                   key={field}
//                   placeholder={field}
//                   value={editedData[field as keyof Dealer] || ""}
//                   onChange={(e) =>
//                     setEditedData((prev) => ({
//                       ...prev,
//                       [field]: e.target.value,
//                     }))
//                   }
//                   className="mb-2 border px-3 py-2 w-full rounded"
//                 />
//               ))}
//               <div className="flex justify-end gap-2 mt-4">
//                 <button
//                   onClick={handleEditSave}
//                   className="bg-green-600 text-white px-4 py-2 rounded"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setEditDealer(null)}
//                   className="bg-gray-300 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation */}
//         {dealerToDelete && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
//               <p className="text-red-700 font-semibold mb-2">Confirm Delete</p>
//               <p>
//                 Delete dealer <strong>{dealerToDelete.dlrName}</strong>?
//               </p>
//               <div className="flex justify-center gap-4 mt-4">
//                 <button
//                   onClick={() => handleDelete(dealerToDelete._id)}
//                   className="bg-red-600 text-white px-4 py-2 rounded"
//                 >
//                   Yes, Delete
//                 </button>
//                 <button
//                   onClick={() => setDealerToDelete(null)}
//                   className="bg-gray-300 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bulk Delete Confirmation */}
//         {showBulkDeleteModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
//               <p className="text-red-700 font-semibold mb-2">
//                 Delete All Dealers?
//               </p>
//               <p>This action cannot be undone.</p>
//               <div className="flex justify-center gap-4 mt-4">
//                 <button
//                   onClick={handleBulkDelete}
//                   className="bg-red-600 text-white px-4 py-2 rounded"
//                 >
//                   Yes, Delete All
//                 </button>
//                 <button
//                   onClick={() => setShowBulkDeleteModal(false)}
//                   className="bg-gray-300 px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modals for Success */}
//         {editSuccess && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
//               <p className="text-green-700 font-semibold mb-4">
//                 Dealer updated successfully!
//               </p>
//               <button
//                 onClick={() => setEditSuccess(false)}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         )}
//         {deleteSuccess && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
//               <p className="text-green-700 font-semibold mb-4">
//                 Dealer deleted successfully!
//               </p>
//               <button
//                 onClick={() => setDeleteSuccess(false)}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         )}
//         {bulkDeleteSuccess && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
//               <p className="text-green-700 font-semibold mb-4">
//                 All dealers deleted successfully!
//               </p>
//               <button
//                 onClick={() => setBulkDeleteSuccess(false)}
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         )}
//         {bulkDeleteError && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
//               <p className="text-red-700 font-semibold mb-4">
//                 Failed to delete all dealers.
//               </p>
//               <button
//                 onClick={() => setBulkDeleteError(false)}
//                 className="bg-gray-700 text-white px-4 py-2 rounded"
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
