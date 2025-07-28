import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import {
 SettingsIcon
} from "lucide-react";

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setGeneratedPassword("");
    setLoading(true);

    const newErrors: FormErrors = {};
    if (!fullName) newErrors.fullName = "Full name is required.";
    if (!email) newErrors.email = "Email is required.";

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

      setSuccessMessage("✅ Admin created successfully.");
      setGeneratedPassword(data.generatedPassword);
      console.log(data);
      setFullName("");
      setEmail("");
    } catch (err: any) {
      setErrors({ general: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-h-screen  flex p-24">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg m-auto px-6 py-10 w-full max-w-sm space-y-4 "
        >
          <h2 className="text-2xl text-center font-bold text-indigo-700">
            Add New Admin
            <SettingsIcon className="inline-block ml-2" />
          </h2>

          {/* Show generated password FIRST */}
          {generatedPassword && (
            <div className="mt-6 bg-green-100 border border-green-500 text-green-800 px-4 py-3 rounded text-sm max-w-md w-full text-center">
              <p className="mb-1">
                🎉 <strong>Temporary Password:</strong>
              </p>

              <div className="flex items-center justify-center gap-2">
                <code className="font-mono bg-white px-2 py-1 rounded border">
                  {generatedPassword}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPassword);
                    setSuccessMessage("Password copied to clipboard!");
                  }}
                  type="button"
                  className="bg-indigo-600 text-white text-xs px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Copy
                </button>
              </div>

              <p className="mt-2">
                Please copy and send to the new admin securely.
              </p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-500 text-green-800 p-3 rounded text-sm">
              {successMessage}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="bg-indigo-100 border border-red-500 text-red-800 p-3 rounded text-sm">
              {errors.general}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold text-sm">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1 mb-5"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
