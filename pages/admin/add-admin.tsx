import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";

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
      <div className="max-h-screen bg-red-50 flex p-24">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg m-auto p-6 w-full max-w-xs space-y-4 "
        >
          <h2 className="text-lg text-center font-bold text-red-700">
            Add New Admin
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
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
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
            <div className="bg-red-100 border border-red-500 text-red-800 p-3 rounded text-sm">
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
              className="w-full border px-3 py-2 rounded mt-1"
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
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
