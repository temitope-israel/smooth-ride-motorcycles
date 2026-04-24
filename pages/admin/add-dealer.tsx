// pages/admin/add-dealer.tsx
import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { Store, MapPin, Phone, User, Building2, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

export default function AddDealer() {
  const [formData, setFormData] = useState({
    exOrMulti: "",
    pic: "",
    dlrName: "",
    region: "",
    state: "",
    town: "",
    address: "",
    phone1: "",
    phone2: "",
    ownerOrContactPerson: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dealerExistsModal, setDealerExistsModal] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const upperCaseFields = ["dlrName", "pic", "region", "town", "ownerOrContactPerson"];
    const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/add-dealer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409) {
        setDealerExistsModal(true);
        return;
      }

      if (!res.ok) throw new Error(data.message || "Failed to register dealer");

      setShowModal(true);
      setFormData({
        exOrMulti: "", pic: "", dlrName: "", region: "", state: "",
        town: "", address: "", phone1: "", phone2: "", ownerOrContactPerson: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Label = ({ children, icon: Icon }: { children: string, icon?: any }) => (
    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {Icon && <Icon size={12} className="text-slate-300" />}
      {children}
    </label>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl shadow-indigo-100/50 rounded-[2.5rem] border border-slate-100 p-10 w-full max-w-3xl space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2 border-b border-slate-50 pb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 mb-2">
              <Store size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dealer Registration</h1>
            <p className="text-slate-500 font-medium">Add a new business partner to the distribution network</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Section: Business Details */}
            <div className="md:col-span-2">
               <h3 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2">
                 <Building2 size={16} /> Business Information
               </h3>
            </div>

            <div className="space-y-1">
              <Label>Dealer Name</Label>
              <input
                name="dlrName"
                value={formData.dlrName}
                onChange={handleChange}
                required
                placeholder="REGAL MOTORS LTD"
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <Label>Business Type</Label>
              <select
                name="exOrMulti"
                value={formData.exOrMulti}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              >
                <option value="">Select Type</option>
                <option value="Exclusive">Exclusive</option>
                <option value="Multi">Multi-Brand</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label>PIC (Person In Charge)</Label>
              <input
                name="pic"
                value={formData.pic}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <Label>Owner / Contact Person</Label>
              <input
                name="ownerOrContactPerson"
                value={formData.ownerOrContactPerson}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              />
            </div>

            {/* Section: Location */}
            <div className="md:col-span-2 pt-4">
               <h3 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2">
                 <MapPin size={16} /> Location Details
               </h3>
            </div>

            <div className="space-y-1">
              <Label>State</Label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              >
                <option value="">Select State</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <Label>Town</Label>
              <input
                list="townSuggestions"
                name="town"
                value={formData.town}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              />
              <datalist id="townSuggestions">
                <option value="IKEJA" /><option value="ABEOKUTA" /><option value="IBADAN" />
              </datalist>
            </div>

            <div className="md:col-span-2 space-y-1">
              <Label>Street Address</Label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-medium text-slate-700"
              />
            </div>

            {/* Section: Contact */}
            <div className="md:col-span-2 pt-4">
               <h3 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2">
                 <Phone size={16} /> Communication
               </h3>
            </div>

            <div className="space-y-1">
              <Label>Primary Phone</Label>
              <input
                type="tel"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                required
                pattern="\d{11}"
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <Label>Secondary Phone (Optional)</Label>
              <input
                type="tel"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                pattern="\d{11}"
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-xl transition-all outline-none font-bold text-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-200 transform active:scale-[0.99] flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register Dealer"}
          </button>
        </form>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Success!</h3>
              <p className="text-slate-500 text-sm leading-relaxed">The dealer has been successfully onboarded to the network.</p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Duplicate Modal */}
        {dealerExistsModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Duplicate Dealer</h3>
              <p className="text-slate-500 text-sm leading-relaxed">A dealer with this identity already exists in this location.</p>
              <button
                onClick={() => setDealerExistsModal(false)}
                className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black"
              >
                Review Details
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


// import AdminLayout from "@/components/AdminLayout";
// import { useState } from "react";

// // ✅ Nigerian states list
// const states = [
//   "Abia",
//   "Adamawa",
//   "Akwa Ibom",
//   "Anambra",
//   "Bauchi",
//   "Bayelsa",
//   "Benue",
//   "Borno",
//   "Cross River",
//   "Delta",
//   "Ebonyi",
//   "Edo",
//   "Ekiti",
//   "Enugu",
//   "FCT - Abuja",
//   "Gombe",
//   "Imo",
//   "Jigawa",
//   "Kaduna",
//   "Kano",
//   "Katsina",
//   "Kebbi",
//   "Kogi",
//   "Kwara",
//   "Lagos",
//   "Nasarawa",
//   "Niger",
//   "Ogun",
//   "Ondo",
//   "Osun",
//   "Oyo",
//   "Plateau",
//   "Rivers",
//   "Sokoto",
//   "Taraba",
//   "Yobe",
//   "Zamfara",
// ];

// export default function AddDealer() {
//   const [formData, setFormData] = useState({
//     exOrMulti: "",
//     pic: "",
//     dlrName: "",
//     region: "",
//     state: "",
//     town: "",
//     address: "",
//     phone1: "",
//     phone2: "",
//     ownerOrContactPerson: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [dealerExistsModal, setDealerExistsModal] = useState(false);

//   // const handleChange = (
//   //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   // ) => {

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     const upperCaseFields = [
//       "dlrName",
//       "pic",
//       "region",
//       "town",
//       "ownerOrContactPerson",
//     ]; // ❌ do NOT include 'state'

//     const newValue = upperCaseFields.includes(name)
//       ? value.toUpperCase()
//       : value;

//     setFormData({ ...formData, [name]: newValue });
//   };

//   //   setFormData({ ...formData, [e.target.name]: e.target.value });
//   // };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setShowModal(false);
//     setDealerExistsModal(false);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/admin/add-dealer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.status === 409) {
//         setDealerExistsModal(true);
//         return;
//       }

//       if (!res.ok) throw new Error(data.message || "Something went wrong");

//       setSuccess("✅ Dealer added successfully.");
//       setShowModal(true);

//       setFormData({
//         exOrMulti: "",
//         pic: "",
//         dlrName: "",
//         region: "",
//         state: "",
//         town: "",
//         address: "",
//         phone1: "",
//         phone2: "",
//         ownerOrContactPerson: "",
//       });
//     } catch (err: any) {
//       setError(err.message || "Error adding dealer.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl space-y-4 text-xs"
//         >
//           <h1 className="text-base font-bold text-red-700 text-center bg-indigo-600 text-white p-4 rounded-lg mb-6">
//             ADD NEW DEALER
//           </h1>

//           {showModal && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//               <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
//                 <h3 className="text-xl font-semibold text-green-700 mb-4">
//                   ✅ Dealer Added Successfully!
//                 </h3>
//                 <p className="mb-6 text-gray-600">
//                   The dealer information has been saved.
//                 </p>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

//           {dealerExistsModal && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//               <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
//                 <h3 className="text-xl font-semibold text-red-700 mb-4">
//                   ⚠️ Dealer Already Exists
//                 </h3>
//                 <p className="mb-6 text-gray-600">
//                   A dealer with the same name, state, and town already exists in
//                   the system.
//                 </p>
//                 <button
//                   onClick={() => setDealerExistsModal(false)}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="bg-indigo-100 border border-red-500 text-red-800 p-3 rounded text-sm">
//               {error}
//             </div>
//           )}

//           {/* Exclusive or Multi */}
//           <div>
//             <label className="block font-bold">
//               Exclusive/Multi (Business)
//             </label>
//             <select
//               name="exOrMulti"
//               value={formData.exOrMulti}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">Select Exclusive/Multi</option>
//               <option value="Exclusive">Exclusive</option>
//               <option value="Multi">Multi</option>
//             </select>
//           </div>

//           {/* PIC */}
//           <div>
//             <label className="block font-bold">PIC</label>
//             <input
//               type="text"
//               name="pic"
//               value={formData.pic.toUpperCase()}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           {/* DLR Name */}
//           <div>
//             <label className="block font-bold">DLR Name</label>
//             <input
//               type="text"
//               name="dlrName"
//               value={formData.dlrName}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter Dealer Name"
//             />
//           </div>

//           {/* Region */}
//           <div>
//             <label className="block font-bold">Region</label>
//             <input
//               type="text"
//               name="region"
//               value={formData.region.toUpperCase()}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           {/* State */}
//           <div>
//             <label className="block font-bold">State</label>
//             <select
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">Select State</option>
//               {states.map((state) => (
//                 <option key={state} value={state}>
//                   {state.toUpperCase()}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Town */}
//           <div>
//             <label className="block font-bold">Town</label>
//             <input
//               list="townSuggestions"
//               type="text"
//               name="town"
//               value={formData.town.toUpperCase()}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter town"
//             />
//             <datalist id="townSuggestions">
//               <option value="Ikeja" />
//               <option value="Abeokuta" />
//               <option value="Ibadan" />
//               <option value="Ilorin" />
//               <option value="Uyo" />
//               <option value="Kano" />
//             </datalist>
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block font-bold">Address</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter full address"
//             />
//           </div>

//           {/* Phone Numbers */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-bold">
//                 Phone Number (Compulsory)
//               </label>
//               <input
//                 type="tel"
//                 name="phone1"
//                 value={formData.phone1}
//                 onChange={handleChange}
//                 required
//                 pattern="\d{11}"
//                 title="Phone number must be exactly 11 digits"
//                 className="w-full border px-3 py-2 rounded"
//                 placeholder="Enter 11-digit phone number"
//               />
//             </div>
//             <div>
//               <label className="block font-bold">Phone Number (Optional)</label>
//               <input
//                 type="tel"
//                 name="phone2"
//                 value={formData.phone2}
//                 onChange={handleChange}
//                 pattern="\d{11}"
//                 title="Phone number must be exactly 11 digits"
//                 className="w-full border px-3 py-2 rounded"
//                 placeholder="Enter 11-digit phone number (optional)"
//               />
//             </div>
//           </div>

//           {/* Contact Person */}
//           <div>
//             <label className="block font-bold">Owner / Contact Person</label>
//             <input
//               type="text"
//               name="ownerOrContactPerson"
//               value={formData.ownerOrContactPerson}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 text-white font-semibold rounded ${
//               loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
//             }`}
//           >
//             {loading ? "Submitting..." : "Add Dealer"}
//           </button>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// }
