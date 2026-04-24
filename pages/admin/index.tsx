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
  }, [router]);

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
    setPage(1); // Reset to first page on search
  }, [search, customers]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
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
    const headers = ["S/N", "Engine No", "Buyer", "Phone", "State", "Dealer", "Date", "Usage", "Model", "Color"];
    const rows = filteredCustomers.map((c, i) => [
      i + 1,
      c.engineNumber,
      `${c.title} ${c.buyerName}`,
      c.phone,
      c.state,
      c.dealer,
      new Date(c.purchaseDate).toLocaleDateString(),
      c.usage,
      c.model,
      c.color,
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Records Management</h1>
            <p className="text-slate-500 text-sm font-medium">Monitoring {customers.length} total registrations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setDeleteAllConfirm(true)}
              className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
            >
              Clear Database
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            placeholder="Filter by Engine, Buyer, Dealer, or State..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 shadow-sm font-medium"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">S/N</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Engine Details</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Buyer Info</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Purchase Info</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((c, i) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {String((page - 1) * pageSize + i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700 font-mono tracking-tighter">{c.engineNumber}</div>
                      <div className="text-[10px] text-indigo-500 font-black uppercase">{c.model} • {c.color}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{c.title} {c.buyerName}</div>
                      <div className="text-xs text-slate-500">{c.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">{c.state}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{c.dealer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{new Date(c.purchaseDate).toLocaleDateString('en-GB')}</div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${c.usage.includes('Commercial') ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {c.usage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setEditCustomer(c)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit Record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(c._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-slate-50/50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Show per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all ${
                    page === i + 1
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
        {editCustomer && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-xl border border-white animate-in zoom-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Edit Registration
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {["buyerName", "phone", "state", "dealer", "model", "color"].map((field) => (
                  <div key={field} className={field === "buyerName" ? "col-span-2" : ""}>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      value={(editCustomer as any)[field]}
                      onChange={(e) => handleEditChange(field as keyof Customer, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={saveEdit} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">SAVE CHANGES</button>
                <button onClick={() => setEditCustomer(null)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-black tracking-widest hover:bg-slate-200 transition-all">CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* Reusable Modal Component Calls */}
        {editSuccess && <Modal message="Record updated successfully!" onClose={() => setEditSuccess(false)} />}

        {deleteId && (
          <Modal
            message="This action cannot be undone. Permanentely delete this record?"
            confirmText="CONFIRM DELETE"
            onConfirm={handleDelete}
            onClose={() => setDeleteId(null)}
            isDanger
          />
        )}

        {deleteSuccess && <Modal message="Record has been purged." onClose={() => setDeleteSuccess(false)} />}

        {deleteAllConfirm && (
          <Modal
            message="CRITICAL: You are about to wipe the entire database. Proceed?"
            confirmText="WIPE DATABASE"
            onConfirm={handleDeleteAll}
            onClose={() => setDeleteAllConfirm(false)}
            isDanger
          />
        )}

        {deleteAllSuccess && <Modal message="Database reset successful." onClose={() => setDeleteAllSuccess(false)} />}
      </div>
    </AdminLayout>
  );
}

function Modal({
  message,
  confirmText,
  onConfirm,
  onClose,
  isDanger = false,
}: {
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  isDanger?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-white animate-in fade-in zoom-in duration-300">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl ${isDanger ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
          {isDanger ? '!' : '✓'}
        </div>
        <p className="text-slate-600 font-bold leading-relaxed mb-8">{message}</p>
        <div className="flex flex-col gap-3">
          {confirmText && onConfirm && (
            <button
              onClick={onConfirm}
              className={`w-full py-4 rounded-2xl font-black tracking-widest text-white transition-all shadow-lg ${isDanger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black tracking-widest hover:bg-slate-200 transition-all"
          >
            {confirmText ? "NEVERMIND" : "CONTINUE"}
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
//   usage: string;
//   endUser?: string;
//   endUserPhone?: string;
//   model: string;
//   color: string;
// }

// export default function Admin() {
//   const router = useRouter();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
//   const [search, setSearch] = useState("");
//   const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
//   const [editSuccess, setEditSuccess] = useState(false);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);
//   const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
//   const [deleteAllSuccess, setDeleteAllSuccess] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     const isAuth = localStorage.getItem("admin-auth");
//     if (isAuth !== "true") router.push("/admin/login");
//   }, []);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   useEffect(() => {
//     const filtered = customers.filter((c) => {
//       const term = search.toLowerCase();
//       return (
//         c.engineNumber.toLowerCase().includes(term) ||
//         c.buyerName.toLowerCase().includes(term) ||
//         c.phone.includes(term) ||
//         c.dealer.toLowerCase().includes(term) ||
//         c.state.toLowerCase().includes(term)
//       );
//     });
//     setFilteredCustomers(filtered);
//   }, [search, customers]);

//   const fetchCustomers = async () => {
//     const res = await fetch("/api/registrations");
//     const data = await res.json();
//     setCustomers(data);
//   };

//   const handleEditChange = (field: keyof Customer, value: string) => {
//     if (editCustomer) {
//       setEditCustomer({ ...editCustomer, [field]: value });
//     }
//   };

//   const saveEdit = async () => {
//     if (!editCustomer) return;
//     const res = await fetch(`/api/update?id=${editCustomer._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(editCustomer),
//     });
//     if (res.ok) {
//       await fetchCustomers();
//       setEditCustomer(null);
//       setEditSuccess(true);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;
//     const res = await fetch(`/api/delete?id=${deleteId}`, {
//       method: "DELETE",
//     });
//     if (res.ok) {
//       await fetchCustomers();
//       setDeleteId(null);
//       setDeleteSuccess(true);
//     }
//   };

//   const handleDeleteAll = async () => {
//     const res = await fetch("/api/admin/delete-all-customers", {
//       method: "DELETE",
//     });
//     if (res.ok) {
//       await fetchCustomers();
//       setDeleteAllConfirm(false);
//       setDeleteAllSuccess(true);
//     }
//   };

//   const paginated = filteredCustomers.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );
//   const totalPages = Math.ceil(filteredCustomers.length / pageSize);

//   const exportCSV = () => {
//     const headers = [
//       "S/N",
//       "Engine Number",
//       "Buyer",
//       "Phone",
//       "State",
//       "Dealer",
//       "Purchase Date",
//       "Usage",
//       "End-User",
//       "End-User Phone",
//       "Model",
//       "Color",
//     ];
//     const rows = filteredCustomers.map((c, i) => [
//       i + 1,
//       c.engineNumber,
//       `${c.title} ${c.buyerName}`,
//       c.phone,
//       c.state,
//       c.dealer,
//       new Date(c.purchaseDate).toLocaleDateString(),
//       c.usage,
//       c.endUser || "",
//       c.endUserPhone || "",
//       c.model,
//       c.color,
//     ]);
//     const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "customers.csv";
//     a.click();
//   };

//   return (
//     <AdminLayout>
//       <div className="p-2 space-y-2 ">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <h1 className="text-2xl font-bold text-indigo-700">Admin Dashboard</h1>
//           <div className="flex gap-2">
//             <button
//               onClick={exportCSV}
//               className="bg-green-600 text-white px-4 py-2 rounded text-xs"
//             >
//               Export CSV
//             </button>
//             <button
//               onClick={() => setDeleteAllConfirm(true)}
//               className="bg-indigo-600 text-white px-4 py-2 rounded text-xs"
//             >
//               Delete All
//             </button>
//           </div>
//         </div>

//         <input
//           type="text"
//           placeholder="Search by engine number, buyer, phone, dealer, state"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border p-2 w-full rounded text-sm"
//         />

//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse mt-6 border border-gray-400 text-[11.5px]">
//             <thead className="bg-indigo-600 text-white">
//               <tr>
//                 <th className="border px-2 py-1">S/N</th>
//                 <th className="border px-2 py-1">Engine Number</th>
//                 <th className="border px-2 py-1">Buyer</th>
//                 <th className="border px-2 py-1">Phone</th>
//                 <th className="border px-2 py-1">State</th>
//                 <th className="border px-2 py-1">Dealer</th>
//                 <th className="border px-2 py-1">Purchase Date</th>
//                 <th className="border px-2 py-1">Usage</th>
//                 <th className="border px-2 py-1">End-User</th>
//                 <th className="border px-2 py-1">End-User Phone</th>
//                 <th className="border px-2 py-1">Model</th>
//                 <th className="border px-2 py-1">Color</th>
//                 <th className="border px-2 py-1">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginated.map((c, i) => (
//                 <tr key={c._id}>
//                   <td className="border px-2 py-1 text-center">
//                     {(page - 1) * pageSize + i + 1}
//                   </td>
//                   <td className="border px-2 py-1">{c.engineNumber}</td>
//                   <td className="border px-2 py-1">{`${c.title} ${c.buyerName}`}</td>
//                   <td className="border px-2 py-1">{c.phone}</td>
//                   <td className="border px-2 py-1">{c.state}</td>
//                   <td className="border px-2 py-1">{c.dealer}</td>
//                   <td className="border px-2 py-1">
//                     {new Date(c.purchaseDate).toLocaleDateString()}
//                   </td>
//                   <td className="border px-2 py-1">{c.usage}</td>
//                   <td className="border px-2 py-1">{c.endUser}</td>
//                   <td className="border px-2 py-1">{c.endUserPhone}</td>
//                   <td className="border px-2 py-1">{c.model}</td>
//                   <td className="border px-2 py-1">{c.color}</td>
//                   <td className="border px-2 py-1 text-center">
//                     <button
//                       onClick={() => setEditCustomer(c)}
//                       className="text-blue-600 hover:underline mr-2"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteId(c._id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-4">
//           <div>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`px-3 py-1 rounded mx-1 text-sm ${
//                   page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//           <div>
//             <label className="text-sm">Page Size:</label>
//             <select
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//               className="ml-2 border px-2 py-1 text-xs"
//             >
//               {[5, 10, 20, 50].map((size) => (
//                 <option key={size}>{size}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Modals */}
//         {editCustomer && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow w-full max-w-md">
//               <h2 className="text-lg font-bold mb-4 text-center">
//                 Edit Customer
//               </h2>
//               {["buyerName", "phone", "state", "dealer", "model", "color"].map(
//                 (field) => (
//                   <div key={field} className="mb-3">
//                     <label className="block text-sm capitalize">{field}</label>
//                     <input
//                       value={(editCustomer as any)[field]}
//                       onChange={(e) =>
//                         handleEditChange(
//                           field as keyof Customer,
//                           e.target.value
//                         )
//                       }
//                       className="w-full border px-3 py-1 rounded"
//                     />
//                   </div>
//                 )
//               )}
//               <div className="flex justify-center gap-4 mt-4">
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

//         {editSuccess && (
//           <Modal
//             message="Edit successful!"
//             onClose={() => setEditSuccess(false)}
//           />
//         )}

//         {deleteId && (
//           <Modal
//             message="Are you sure you want to delete this customer?"
//             confirmText="Yes, Delete"
//             onConfirm={handleDelete}
//             onClose={() => setDeleteId(null)}
//           />
//         )}

//         {deleteSuccess && (
//           <Modal
//             message="Customer deleted successfully."
//             onClose={() => setDeleteSuccess(false)}
//           />
//         )}

//         {deleteAllConfirm && (
//           <Modal
//             message="Are you sure you want to delete all customers?"
//             confirmText="Yes, Delete All"
//             onConfirm={handleDeleteAll}
//             onClose={() => setDeleteAllConfirm(false)}
//           />
//         )}

//         {deleteAllSuccess && (
//           <Modal
//             message="All customers deleted successfully."
//             onClose={() => setDeleteAllSuccess(false)}
//           />
//         )}
//       </div>
//     </AdminLayout>
//   );
// }

// function Modal({
//   message,
//   confirmText,
//   onConfirm,
//   onClose,
// }: {
//   message: string;
//   confirmText?: string;
//   onConfirm?: () => void;
//   onClose: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
//         <p className="mb-4">{message}</p>
//         <div className="flex justify-center gap-4">
//           {confirmText && onConfirm && (
//             <button
//               onClick={onConfirm}
//               className="bg-indigo-600 text-white px-4 py-2 rounded"
//             >
//               {confirmText}
//             </button>
//           )}
//           <button
//             onClick={onClose}
//             className="bg-gray-300 text-black px-4 py-2 rounded"
//           >
//             {confirmText ? "Cancel" : "OK"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
