import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-auth");
    if (isAuth === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials provided");
      }

      localStorage.setItem("admin-auth", "true");
      localStorage.setItem("admin-role", data.role || "admin");

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "A connection error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-600 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-400 rounded-full blur-[120px] opacity-10" />

      <div className="w-full max-w-md z-10">
        {/* Header/Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20 ring-4 ring-indigo-900">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SMOOTH RIDE</h1>
          <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Management Console</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white/10"
        >
          <h2 className="text-xl font-bold mb-6 text-slate-800">Administrator Login</h2>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-rose-500 shrink-0" size={18} />
              <p className="text-rose-600 text-xs font-bold leading-tight">{error}</p>
            </div>
          )}

          {/* Sample Credentials Box */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-6">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Test Environment Access</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-600 font-medium">Email: <span className="text-indigo-600 font-bold select-all">test@mail.com</span></p>
              <p className="text-xs text-slate-600 font-medium">Pass: <span className="text-indigo-600 font-bold select-all">2417fe</span></p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block mb-1.5 ml-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-semibold"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-1.5 ml-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-slate-50 border border-slate-100 pl-12 pr-12 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm font-semibold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black tracking-[0.15em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                VERIFYING...
              </span>
            ) : "SIGN IN"}
          </button>
        </form>

        <p className="mt-8 text-center text-indigo-400/60 text-[10px] font-bold uppercase tracking-widest">
          Authorized Personnel Only &copy; 2026 Smooth Ride
        </p>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { Eye, EyeOff } from "lucide-react";

// export default function AdminLogin() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Redirect if already logged in
//   useEffect(() => {
//     const isAuth = localStorage.getItem("admin-auth");
//     if (isAuth === "true") {
//       router.push("/admin");
//     }
//   }, [router]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/admin-login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Login failed");
//       }

//       localStorage.setItem("admin-auth", "true");
//       localStorage.setItem("admin-role", data.role || "admin");

//       router.push("/admin");
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
//           Admin Login
//         </h2>

//         {error && (
//           <p className="text-indigo-600 mb-3 text-center text-sm font-medium">
//             {error}
//           </p>
//         )}

//         <div>
//           <p>
//             Login Details:{" "}
//             <span className="font-bold text-red-500">Sample User</span>
//             <br />{" "}
//             <span className="font-bold text-green-500">
//               Email: test@mail.com <br /> Password: 2417fe
//             </span>
//           </p>
//         </div>

//         {/* Email */}
//         <label className="block mb-1 text-sm font-medium text-gray-700">
//           Email
//         </label>
//         <input
//           type="email"
//           className="w-full border border-gray-300 px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         {/* Password */}
//         <label className="block mb-1 text-sm font-medium text-gray-700">
//           Password
//         </label>
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword((prev) => !prev)}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//           >
//             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </button>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded font-medium disabled:opacity-50"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
