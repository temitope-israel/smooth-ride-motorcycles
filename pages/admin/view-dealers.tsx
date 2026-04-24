import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState, useCallback } from "react";
import {
  Trash2, PencilLine, Download, Search,
  MapPin, Phone, User, AlertTriangle,
  CheckCircle2, Loader2
} from "lucide-react";

type Dealer = {
  _id: string;
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

  // Consolidated Fetch Function
  const fetchDealers = useCallback(async () => {
    setLoading(true);
    try {
      // Ensuring we use the correct paginated endpoint
      const res = await fetch(
        `/api/admin/view-dealers?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setDealers(data.dealers || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/delete-dealer/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setDealerToDelete(null);
      setDeleteSuccess(true);
      fetchDealers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const res = await fetch("/api/admin/delete-all-dealers", { method: "DELETE" });
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
    const headers = ["S/N", "PIC", "Dealer Name", "Region", "State", "Town", "Address", "Phone 1", "Phone 2", "Owner"];
    const rows = dealers.map((d, i) => [
      (currentPage - 1) * itemsPerPage + i + 1,
      d.pic, d.dlrName, d.region, d.state, d.town, d.address, d.phone1, d.phone2 || "", d.ownerOrContactPerson || ""
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dealers_list.csv";
    a.click();
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch("/api/admin/update-dealer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editDealer?._id, updatedData: editedData }),
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
      <div className="p-4 md:p-10 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dealers</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Network Logistics & Management</p>
            </div>
            <div className="flex gap-3">
               <button onClick={exportToCSV} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95">
                 <Download size={16} /> EXPORT CSV
               </button>
               <button onClick={() => setShowBulkDeleteModal(true)} className="bg-white text-rose-600 border border-rose-100 px-6 py-3 rounded-2xl font-black text-xs hover:bg-rose-50 transition-all">
                 FLUSH DATABASE
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input
                type="text"
                placeholder="Search name, region, or state..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              className="bg-white border-none rounded-[1.5rem] px-6 py-4 text-sm font-bold text-slate-600 shadow-sm outline-none cursor-pointer"
            >
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>Show {n}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    {["S/N", "Dealer Identity", "Location", "Contact Personnel", "Actions"].map(h => (
                      <th key={h} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-32 text-center">
                        <Loader2 className="animate-spin mx-auto text-indigo-600 mb-4" size={40} />
                        <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Retrieving secure data...</span>
                      </td>
                    </tr>
                  ) : dealers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-32 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">No matching records found</td>
                    </tr>
                  ) : dealers.map((d, i) => (
                    <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-6 text-[10px] font-black text-slate-300">
                        {String((currentPage - 1) * itemsPerPage + i + 1).padStart(2, '0')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-800 text-sm tracking-tight">{d.dlrName}</div>
                        <div className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-widest">PIC: {d.pic}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <MapPin size={14} className="text-indigo-400" /> {d.town}, {d.state}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1.5 font-medium italic">{d.address}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                           <Phone size={14} className="text-slate-300" /> {d.phone1}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-2 uppercase">
                           <User size={14} className="text-slate-300" /> {d.ownerOrContactPerson}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditDealer(d); setEditedData(d); }} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                            <PencilLine size={20} />
                          </button>
                          <button onClick={() => setDealerToDelete(d)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center gap-3 py-10">
            {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-2xl scale-110" : "bg-white text-slate-400 hover:bg-slate-100 shadow-sm"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* --- MODALS --- */}

        {editDealer && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-8 border border-slate-100">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 uppercase">Update Dealer</h2>
                <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">System Record Modification</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {["pic", "dlrName", "region", "state", "town", "address", "phone1", "phone2", "ownerOrContactPerson"].map((field) => (
                  <div key={field} className={field === "address" || field === "dlrName" ? "md:col-span-2" : ""}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      value={editedData[field as keyof Dealer] || ""}
                      onChange={(e) => setEditedData(prev => ({ ...prev, [field]: e.target.value.toUpperCase() }))}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={handleEditSave} className="flex-[2] bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 active:scale-95 transition-all">SAVE UPDATES</button>
                <button onClick={() => setEditDealer(null)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black active:scale-95 transition-all">CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {dealerToDelete && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-sm w-full text-center space-y-8">
              <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto"><Trash2 size={40} /></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase">Confirm</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">Permanently remove <span className="font-black text-slate-900">{dealerToDelete.dlrName}</span> from the directory?</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleDelete(dealerToDelete._id)} className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-rose-100 active:scale-95 transition-all">YES, DELETE RECORD</button>
                <button onClick={() => setDealerToDelete(null)} className="w-full bg-slate-100 text-slate-500 py-5 rounded-2xl font-black active:scale-95 transition-all">KEEP IT</button>
              </div>
            </div>
          </div>
        )}

        {showBulkDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl max-w-md w-full text-center space-y-8 border-8 border-rose-50">
              <div className="w-24 h-24 bg-rose-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl"><AlertTriangle size={48} /></div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-rose-600 uppercase tracking-tighter">System Flush</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">This command will wipe the <span className="font-black">ENTIRE</span> dealer database. This action is irreversible.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={handleBulkDelete} className="w-full bg-rose-600 text-white py-6 rounded-3xl font-black shadow-2xl shadow-rose-200">CONFIRM WIPE</button>
                <button onClick={() => setShowBulkDeleteModal(false)} className="w-full bg-slate-100 text-slate-500 py-5 rounded-2xl font-black">ABORT MISSION</button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Success Toasts */}
        {(editSuccess || deleteSuccess || bulkDeleteSuccess) && (
          <div className="fixed bottom-12 right-12 z-[60] flex items-center gap-6 bg-slate-900 text-white pl-8 pr-4 py-5 rounded-[2rem] font-black shadow-2xl animate-in fade-in slide-in-from-right-10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={20} />
              <span className="uppercase tracking-[0.2em] text-[10px]">
                {editSuccess ? "Database Updated" : deleteSuccess ? "Dealer Removed" : "Database Wiped"}
              </span>
            </div>
            <button onClick={() => { setEditSuccess(false); setDeleteSuccess(false); setBulkDeleteSuccess(false); }} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] transition-colors">DISMISS</button>
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
//   const [totalCount, setTotalCount] = useState(0);

//   const fetchDealers = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `/api/admin/view-dealers?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
//       );

//       const data = await res.json();
//       setDealers(data.dealers || []);
//       setTotalCount(data.total || 0);
//     } catch (err) {
//       console.error("Failed to fetch dealers:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDealers();
//   }, [currentPage, itemsPerPage, searchTerm]);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page on new search
//   };

//   useEffect(() => {
//     const fetchDealers = async () => {
//       const res = await fetch("/api/dealers");
//       const data = await res.json();
//       setDealers(data); // no pagination here
//     };

//     fetchDealers();
//   }, []);

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

//     const rows = dealers.map((d, i) => [
//       i + 1,
//       d.pic,
//       d.dlrName,
//       d.region,
//       d.state,
//       d.town,
//       d.address,
//       d.phone1,
//       d.phone2 || "",
//       d.ownerOrContactPerson || "",
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) =>
//         row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
//       )
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "dealers.csv";
//     a.click();
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
//       <div className="p-6 min-h-screen bg-indigo-50 text-xs">
//         <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center mb-4">
//           <h2 className="text-2xl font-bold text-indigo-700">View Dealers</h2>
//           <div className="flex gap-2 flex-wrap">
//             <input
//               type="text"
//               placeholder="Search dealers..."
//               value={searchTerm}
//               onChange={handleSearchChange}
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
//               className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-xs"
//             >
//               Delete All Dealers
//             </button>
//           </div>
//         </div>
//         <select
//           value={itemsPerPage}
//           onChange={(e) => {
//             setItemsPerPage(parseInt(e.target.value));
//             setCurrentPage(1); // reset to first page
//           }}
//           className="border px-3 py-2 rounded text-xs"
//         >
//           {[10, 20, 50, 100].map((num) => (
//             <option key={num} value={num}>
//               Show {num}
//             </option>
//           ))}
//         </select>
//         {loading ? (
//           <p>Loading dealers...</p>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded shadow border mt-10">
//             <table className="min-w-full divide-y divide-gray-200 text-[12px]">
//               <thead className="bg-indigo-100 text-left">
//                 <tr>
//                   {[
//                     "S/N",
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
//                 {dealers.map((d, i) => (
//                   <tr key={d._id}>
//                     <td className="px-4 py-2">
//                       {(currentPage - 1) * itemsPerPage + i + 1}
//                     </td>
//                     <td className="border px-4 py-2">{d.pic}</td>
//                     <td className="border px-4 py-2">{d.dlrName}</td>
//                     <td className="border px-4 py-2">{d.region}</td>
//                     <td className="border px-4 py-2">{d.state}</td>
//                     <td className="border px-4 py-2">{d.town}</td>
//                     <td className="border px-4 py-2">{d.address}</td>
//                     <td className="border px-4 py-2">{d.phone1}</td>
//                     <td className="border px-4 py-2">{d.phone2}</td>
//                     <td className="border px-4 py-2">
//                       {d.ownerOrContactPerson}
//                     </td>
//                     <td className="border px-4 py-2 flex gap-2">
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
//                         className="text-indigo-600"
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
//         {/* ✅ Pagination (based on totalCount) */}
//         <div className="flex justify-center gap-2 mt-4 flex-wrap">
//           {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }).map(
//             (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 rounded ${
//                   currentPage === i + 1
//                     ? "bg-indigo-600 text-white"
//                     : "bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             )
//           )}
//         </div>
//         {/* ✅ Other modals (edit, delete, success, etc.) remain unchanged */}
//         {/* ... keep your modals for edit/save/delete/etc. here ... */}
//         {/* Edit Modal */}
//         {editDealer && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg max-w-lg w-full">
//               <h2 className="text-lg font-semibold mb-4 text-indigo-700">
//                 Edit Dealer
//               </h2>
//               {[
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
//               <p className="text-indigo-700 font-semibold mb-2">Confirm Delete</p>
//               <p>
//                 Delete dealer <strong>{dealerToDelete.dlrName}</strong>?
//               </p>
//               <div className="flex justify-center gap-4 mt-4">
//                 <button
//                   onClick={() => handleDelete(dealerToDelete._id)}
//                   className="bg-indigo-600 text-white px-4 py-2 rounded"
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
//               <p className="text-indigo-700 font-semibold mb-2">
//                 Delete All Dealers?
//               </p>
//               <p>This action cannot be undone.</p>
//               <div className="flex justify-center gap-4 mt-4">
//                 <button
//                   onClick={handleBulkDelete}
//                   className="bg-indigo-600 text-white px-4 py-2 rounded"
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
//                 className="bg-indigo-600 text-white px-4 py-2 rounded"
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
//                 className="bg-indigo-600 text-white px-4 py-2 rounded"
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
//                 className="bg-indigo-600 text-white px-4 py-2 rounded"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         )}
//         {bulkDeleteError && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
//               <p className="text-indigo-700 font-semibold mb-4">
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

