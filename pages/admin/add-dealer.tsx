import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";

// ✅ Nigerian states list
const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function AddDealer() {
  const [formData, setFormData] = useState({
    status: "",
    exOrMulti: "",
    hondaExclusiveOutlet: "",
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
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dealerExistsModal, setDealerExistsModal] = useState(false);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const upperCaseFields = [
      "dlrName",
      "pic",
      "region",
      "town",
      "ownerOrContactPerson",
    ]; // ❌ do NOT include 'state'

    const newValue = upperCaseFields.includes(name)
      ? value.toUpperCase()
      : value;

    setFormData({ ...formData, [name]: newValue });
  };

  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowModal(false);
    setDealerExistsModal(false);
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

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess("✅ Dealer added successfully.");
      setShowModal(true);

      setFormData({
        status: "",
        exOrMulti: "",
        hondaExclusiveOutlet: "",
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
    } catch (err: any) {
      setError(err.message || "Error adding dealer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl space-y-4 text-xs"
        >
          <h1 className="text-base font-bold text-red-700 text-center bg-red-600 text-white p-4 rounded-lg mb-6">
            ADD NEW DEALER
          </h1>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
                <h3 className="text-xl font-semibold text-green-700 mb-4">
                  ✅ Dealer Added Successfully!
                </h3>
                <p className="mb-6 text-gray-600">
                  The dealer information has been saved.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {dealerExistsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
                <h3 className="text-xl font-semibold text-red-700 mb-4">
                  ⚠️ Dealer Already Exists
                </h3>
                <p className="mb-6 text-gray-600">
                  A dealer with the same name, state, and town already exists in
                  the system.
                </p>
                <button
                  onClick={() => setDealerExistsModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-500 text-red-800 p-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* All form fields below remain the same */}
          {/* Status */}
          <div>
            <label className="block font-bold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select status</option>
              <option value="1s">1s</option>
              <option value="2s">2s</option>
              <option value="3s">3s</option>
            </select>
          </div>

          {/* Exclusive or Multi */}
          <div>
            <label className="block font-bold">
              Exclusive/Multi (Business)
            </label>
            <select
              name="exOrMulti"
              value={formData.exOrMulti}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Exclusive/Multi</option>
              <option value="Exclusive">Exclusive</option>
              <option value="Multi">Multi</option>
            </select>
          </div>

          {/* Honda Exclusive Outlet */}
          <div>
            <label className="block font-bold">Honda Exclusive Outlet</label>
            <select
              name="hondaExclusiveOutlet"
              value={formData.hondaExclusiveOutlet}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Exclusive/Multi</option>
              <option value="Exclusive">Exclusive</option>
              <option value="Multi">Multi</option>
            </select>
          </div>

          {/* PIC */}
          <div>
            <label className="block font-bold">PIC</label>
            <input
              type="text"
              name="pic"
              value={formData.pic.toUpperCase()}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* DLR Name */}
          <div>
            <label className="block font-bold">DLR Name</label>
            <input
              type="text"
              name="dlrName"
              value={formData.dlrName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter Dealer Name"
            />
          </div>

          {/* Region */}
          <div>
            <label className="block font-bold">Region</label>
            <input
              type="text"
              name="region"
              value={formData.region.toUpperCase()}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* State */}
          <div>
            <label className="block font-bold">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Town */}
          <div>
            <label className="block font-bold">Town</label>
            <input
              list="townSuggestions"
              type="text"
              name="town"
              value={formData.town.toUpperCase()}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter town"
            />
            <datalist id="townSuggestions">
              <option value="Ikeja" />
              <option value="Abeokuta" />
              <option value="Ibadan" />
              <option value="Ilorin" />
              <option value="Uyo" />
              <option value="Kano" />
            </datalist>
          </div>

          {/* Address */}
          <div>
            <label className="block font-bold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter full address"
            />
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold">
                Phone Number (Compulsory)
              </label>
              <input
                type="tel"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                required
                pattern="\d{11}"
                title="Phone number must be exactly 11 digits"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter 11-digit phone number"
              />
            </div>
            <div>
              <label className="block font-bold">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                pattern="\d{11}"
                title="Phone number must be exactly 11 digits"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter 11-digit phone number (optional)"
              />
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <label className="block font-bold">Owner / Contact Person</label>
            <input
              type="text"
              name="ownerOrContactPerson"
              value={formData.ownerOrContactPerson}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Submitting..." : "Add Dealer"}
          </button>
        </form>
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
//     status: "",
//     exOrMulti: "",
//     hondaExclusiveOutlet: "",
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
//   const [ownerOrContactPerson, setOwnerOrContactPerson] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     //setSuccess("");
//     setError("");
//     setLoading(true);
//     setShowModal(true);

//     try {
//       const res = await fetch("/api/admin/add-dealer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Something went wrong");

//       setSuccess("✅ Dealer added successfully.");
//       setFormData({
//         status: "",
//         exOrMulti: "",
//         hondaExclusiveOutlet: "",
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
//       <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl space-y-4 text-xs"
//         >
//           <h1 className="text-base font-bold text-red-700 text-center bg-red-600 text-white p-4 rounded-lg mb-6">
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
//                   className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="bg-red-100 border border-red-500 text-red-800 p-3 rounded text-sm">
//               {error}
//             </div>
//           )}

//           {/* Status */}
//           <div>
//             <label className="block font-bold">Status</label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">Select status</option>
//               <option value="1s">1s</option>
//               <option value="2s">2s</option>
//               <option value="3s">3s</option>
//             </select>
//           </div>

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
//           {/* Honda Exclusive Outlet */}
//           <div>
//             <label className="block font-bold">Honda Exclusive Outlet</label>
//             <select
//               name="hondaExclusiveOutlet"
//               value={formData.hondaExclusiveOutlet}
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

//           {/* State dropdown */}
//           <div>
//             <label className="block font-bold">State</label>
//             <select
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             >
//               <option value="">Select State</option>
//               {states.map((state) => (
//                 <option key={state} value={state}>
//                   {state.toUpperCase()}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Town with suggestions */}
//           <div>
//             <label className="block font-bold">Town</label>
//             <input
//               list="townSuggestions"
//               type="text"
//               name="town"
//               value={formData.town.toUpperCase()}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
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
//             {/* Phone 1 - Required & 11 digits only */}
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

//             {/* Phone 2 - Optional but also must be 11 digits if provided */}
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

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 text-white font-semibold rounded ${
//               loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
//             }`}
//           >
//             {loading ? "Submitting..." : "Add Dealer"}
//           </button>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// }
