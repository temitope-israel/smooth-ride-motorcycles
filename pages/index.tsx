// pages/index.tsx
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ShieldCheck, User } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-red-100 to-white flex items-center justify-center p-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden"
      >
        {/* Left Section */}
        <div className="bg-red-600 text-white p-8 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
            Honda Motorcycle
            <br /> Registration System
          </h1>
          <p className="text-red-100 text-sm leading-relaxed">
            Track and manage all registered motorcycles in one place. Dealer and
            admin access only.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-8 flex flex-col justify-center items-center space-y-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/admin/login")}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg text-sm shadow hover:bg-red-700 transition"
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Login
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("dealer/register")}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 px-6 rounded-lg text-sm shadow hover:bg-gray-200 transition"
          >
            <User className="w-5 h-5" />I Am A Dealer
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
