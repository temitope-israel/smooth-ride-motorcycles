// pages/admin/add-admin.tsx
import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { SettingsIcon, UserPlus, Copy, CheckCircle2, AlertCircle } from "lucide-react";

type FormErrors = {
  fullName?: string;
  email?: string;
  general?: string;
};

export default function AddAdmin() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setGeneratedPassword("");
    setLoading(true);

    const newErrors: FormErrors = {};
    if (!fullName) newErrors.fullName = "Full name is required.";
    if (!email) newErrors.email = "Email address is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setGeneratedPassword(data.generatedPassword);
      setSuccessMessage("Admin profile created successfully.");
      setFullName("");
      setEmail("");
    } catch (err: any) {
      setErrors({ general: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl shadow-slate-200/60 rounded-[2.5rem] p-10 border border-slate-100 space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
                <UserPlus size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                New Administrator
              </h2>
              <p className="text-slate-500 text-sm font-medium">Assign access permissions to your team</p>
            </div>

            {/* Generated Password Result */}
            {generatedPassword && (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-3 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 size={16} />
                  Credentials Generated
                </div>
                <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-emerald-200 shadow-sm">
                  <code className="flex-1 font-mono font-bold text-slate-700">
                    {generatedPassword}
                  </code>
                  <button
                    onClick={handleCopy}
                    type="button"
                    className={`p-2 rounded-xl transition-all ${
                      copied ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-emerald-600/80 leading-relaxed font-medium">
                  Copy this temporary password now. For security, it won't be shown again.
                </p>
              </div>
            )}

            {/* Status Messages */}
            {errors.general && (
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold">
                <AlertCircle size={18} />
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs uppercase tracking-widest ml-1 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-2xl transition-all outline-none text-slate-800 font-medium"
                />
                {errors.fullName && (
                  <p className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1 uppercase">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs uppercase tracking-widest ml-1 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 px-4 py-3 rounded-2xl transition-all outline-none text-slate-800 font-medium"
                />
                {errors.email && (
                  <p className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1 uppercase">{errors.email}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-black rounded-2xl transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-200 ${
                loading ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Registering..." : "Create Admin Account"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}


// import AdminLayout from "@/components/AdminLayout";
// import { useState } from "react";
// import {
//  SettingsIcon
// } from "lucide-react";

// type FormErrors = {
//   fullName?: string;
//   email?: string;
//   general?: string;
// };

// export default function AddAdmin() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [generatedPassword, setGeneratedPassword] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setSuccessMessage("");
//     setGeneratedPassword("");
//     setLoading(true);

//     const newErrors: FormErrors = {};
//     if (!fullName) newErrors.fullName = "Full name is required.";
//     if (!email) newErrors.email = "Email is required.";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/admin/add-admin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fullName, email }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Something went wrong");

//       setSuccessMessage("✅ Admin created successfully.");
//       setGeneratedPassword(data.generatedPassword);
//       console.log(data);
//       setFullName("");
//       setEmail("");
//     } catch (err: any) {
//       setErrors({ general: err.message || "Something went wrong." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="max-h-screen  flex p-24">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-lg rounded-lg m-auto px-6 py-10 w-full max-w-sm space-y-4 "
//         >
//           <h2 className="text-2xl text-center font-bold text-indigo-700">
//             Add New Admin
//             <SettingsIcon className="inline-block ml-2" />
//           </h2>

//           {/* Show generated password FIRST */}
//           {generatedPassword && (
//             <div className="mt-6 bg-green-100 border border-green-500 text-green-800 px-4 py-3 rounded text-sm max-w-md w-full text-center">
//               <p className="mb-1">
//                 🎉 <strong>Temporary Password:</strong>
//               </p>

//               <div className="flex items-center justify-center gap-2">
//                 <code className="font-mono bg-white px-2 py-1 rounded border">
//                   {generatedPassword}
//                 </code>
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(generatedPassword);
//                     setSuccessMessage("Password copied to clipboard!");
//                   }}
//                   type="button"
//                   className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
//                 >
//                   Copy
//                 </button>
//               </div>

//               <p className="mt-2">
//                 Please copy and send to the new admin securely.
//               </p>
//             </div>
//           )}

//           {/* Success Message */}
//           {successMessage && (
//             <div className="bg-green-100 border border-green-500 text-green-800 p-3 rounded text-sm">
//               {successMessage}
//             </div>
//           )}

//           {/* General Error */}
//           {errors.general && (
//             <div className="bg-indigo-100 border border-red-500 text-red-800 p-3 rounded text-sm">
//               {errors.general}
//             </div>
//           )}

//           {/* Full Name */}
//           <div>
//             <label className="block text-gray-700 font-semibold text-sm">
//               Full Name
//             </label>
//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full border px-3 py-2 rounded mt-1"
//             />
//             {errors.fullName && (
//               <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-gray-700 font-semibold text-sm">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border px-3 py-2 rounded mt-1 mb-5"
//             />
//             {errors.email && (
//               <p className="text-red-600 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 text-white font-semibold rounded ${
//               loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
//             }`}
//           >
//             {loading ? "Adding..." : "Add Admin"}
//           </button>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// }
