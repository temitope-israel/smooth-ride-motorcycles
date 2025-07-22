"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("../../components/Scanner"), {
  ssr: false,
  loading: () => (
    <p className="text-center text-sm text-gray-500">Loading scanner...</p>
  ),
});

// Types
interface FormData {
  title: string;
  buyerName: string;
  phone: string;
  state: string;
  dealer: string;
  purchaseDate: string;
  usage: string;
  endUser: string;
  endUserPhone: string;
  model: string;
  variant: string;
  color: string;
  rimType: string;
  startType: string;
}

interface Errors {
  [key: string]: string;
}

// Data
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
  "FCT",
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

const modelsWithDetails: Record<
  string,
  { color: string[]; variant?: string[] }
> = {
  "Ace 110": {
    color: ["Blue", "Red"],
    variant: ["Spoke - Kick Start", "Alloy - Kick Start", "Alloy - Self Start"],
  },
  "Ace 125": {
    color: ["Blue", "Red"],
    variant: ["Spoke - Kick Start", "Alloy - Kick Start", "Alloy - Self Start"],
  },
  "Ace 150": { color: ["Black", "Red"], variant: ["Alloy"] },
  "CGL 125": { color: ["Blue", "Red"] },
  "CB Unicorn": {
    color: ["Black", "Grey", "Red", "White"],
    variant: ["Alloy"],
  },
  Dream: { color: ["Grey", "Red"] },
  "Wave 110": { color: ["Black", "Blue"], variant: ["Alloy"] },
};

export default function Register() {
  const [engineNumber, setEngineNumber] = useState<string>("");
  const [scannerMode, setScannerMode] = useState<string>("none");
  const [scannerLoading, setScannerLoading] = useState<boolean>(false);
  const [scannerInput, setScannerInput] = useState<string>("");
  const [scannerTimeout, setScannerTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [dealers, setDealers] = useState<string[]>([]);
  const [dealerPassword, setDealerPassword] = useState("");

  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [envPassword, setEnvPassword] = useState(""); // we'll fetch this from API
  const [errorModal, setErrorModal] = useState("");

  const [form, setForm] = useState<FormData>({
    title: "",
    buyerName: "",
    phone: "",
    state: "",
    dealer: "",
    purchaseDate: "",
    usage: "",
    endUser: "",
    endUserPhone: "",
    model: "",
    variant: "",
    color: "",
    rimType: "",
    startType: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "model") {
      // When model changes, reset variant, rimType, startType, color
      setForm((prev) => ({
        ...prev,
        model: value,
        variant: "",
        rimType: "",
        startType: "",
        color: "",
      }));
    } else if (field === "variant") {
      // Extract rimType and startType from variant string if available
      const [rimType = "", startType = ""] = value.split(" - ");
      setForm((prev) => ({ ...prev, variant: value, rimType, startType }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleScanSuccess = (data: string) => {
    setEngineNumber(data);
    setScannerMode("none");
    setScannerLoading(false);
    setScanSuccess(true);
    console.log("Scan success triggered");
  };

  const resetScanOnly = () => {
    setEngineNumber("");
    setScannerInput("");
    setScanSuccess(false);
    setScannerMode("external");
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!engineNumber) newErrors.engineNumber = "Engine number is required.";
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.buyerName) newErrors.buyerName = "Buyer name is required.";
    if (!form.phone || form.phone.length !== 11)
      newErrors.phone = "Phone must be 11 digits.";
    if (!form.state) newErrors.state = "State is required.";
    if (!form.dealer) newErrors.dealer = "Dealer is required.";
    if (!form.purchaseDate)
      newErrors.purchaseDate = "Purchase date is required.";
    if (!form.usage) newErrors.usage = "Usage is required.";
    if (!form.model) newErrors.model = "Model is required.";
    if (modelsWithDetails[form.model]?.variant && !form.variant)
      newErrors.variant = "Variant is required.";
    if (!form.color) newErrors.color = "Color is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    // 👇 Build and clean payload (remove empty or undefined values)
    const rawData = { engineNumber, ...form };
    const cleanedData = Object.fromEntries(
      Object.entries(rawData).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    console.log("Submitting cleaned data:", cleanedData);

    try {
      const res = await fetch("/api/register-customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register.");

      setSuccessMessage("✅ Registration successful!");
      // Optional: Reset form here if needed
    } catch (err: any) {
      setErrors({ general: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT"
      )
        return;

      if (scannerTimeout) clearTimeout(scannerTimeout);

      if (e.key === "Enter") {
        const cleaned = scannerInput.replace(/Shift/g, "").trim();
        if (cleaned) {
          setEngineNumber(cleaned);
          setScannerInput("");
          setScanSuccess(true);

          // ✅ Do not immediately hide — delay if needed
          setTimeout(() => {
            setScannerMode("none");
            setScanSuccess(false);
          }, 3000); // 3 seconds
          return;
        }
      } else {
        setScannerInput((prev) => prev + e.key);
      }

      const timeout = setTimeout(() => {
        setScannerInput("");
      }, 1000);
      setScannerTimeout(timeout);
    };

    if (scannerMode === "external" && !scanSuccess) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scannerInput, scannerMode, scanSuccess]);

  useEffect(() => {
    async function fetchDealers() {
      try {
        const res = await fetch("/api/get-dealers");
        const data = await res.json();
        if (res.ok) {
          setDealers(data.dealers);
        } else {
          console.error("Failed to load dealers:", data.message);
        }
      } catch (err) {
        console.error("Error fetching dealers:", err);
      }
    }

    fetchDealers();
    async function fetchPassword() {
      try {
        const res = await fetch("/api/get-register-password");
        const data = await res.json();
        if (res.ok) {
          setEnvPassword(data.password);
        } else {
          console.error("Failed to load password");
        }
      } catch (err) {
        console.error("Password fetch error:", err);
      }
    }

    fetchPassword();
  }, []); // ✅ Empty dependency array = run once on page load

  const handlePasswordConfirm = async () => {
    if (passwordInput !== envPassword) {
      setShowPasswordModal(false);
      setErrorModal("❌ Incorrect password.");
      return;
    }

    setShowPasswordModal(false);
    setLoading(true);
    setErrors({});

    const rawData = { engineNumber, ...form };
    const cleanedData = Object.fromEntries(
      Object.entries(rawData).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    try {
      const res = await fetch("/api/register-customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register.");

      setSuccessMessage("✅ Registration successful!");
      setForm({
        title: "",
        buyerName: "",
        phone: "",
        state: "",
        dealer: "",
        purchaseDate: "",
        usage: "",
        endUser: "",
        endUserPhone: "",
        model: "",
        variant: "",
        color: "",
        rimType: "",
        startType: "",
      });
      setEngineNumber("");
      setScannerInput("");
      setScannerMode("none");
      setScanSuccess(false);
    } catch (err: any) {
      setErrors({ general: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
      setPasswordInput("");
    }
  };

  {
    errorModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
          <h2 className="text-sm font-semibold text-red-700 mb-4">
            {errorModal}
          </h2>
          <button
            onClick={() => setErrorModal("")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-xs mx-auto mt-6 px-4 relative">
      <h1 className="text-xl font-bold text-center text-red-700 mb-4">
        Honda Bike Registration
      </h1>

      {/* Scanner Mode Buttons */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-xs"
          onClick={() => {
            setScannerMode("camera");
            setScannerLoading(true);
            setTimeout(() => setScannerLoading(false), 800);
          }}
        >
          Use Phone Camera
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-xs"
          onClick={() => {
            setScannerMode("external");
            setScannerInput("");
            // setScanSuccess(false);
          }}
        >
          Use External Scanner
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-xs"
          onClick={resetScanOnly}
        >
          Reset Engine Number
        </button>
      </div>

      {/* External Scanner Input */}
      {scannerMode === "external" && (
        <div className="mb-4 text-center">
          {scanSuccess ? (
            <p className="text-green-700 font-medium">✅ Scan successful!</p>
          ) : (
            <p className="text-gray-500 italic animate-pulse">
              Waiting for scan...
            </p>
          )}
        </div>
      )}

      {scannerMode === "camera" && !scannerLoading && (
        <div className="mb-4">
          <Scanner onScanSuccess={handleScanSuccess} />
          <button
            className="mt-2 text-sm text-red-600 underline"
            onClick={() => setScannerMode("none")}
          >
            Cancel and Go Back
          </button>
        </div>
      )}

      {scannerMode === "camera" && scannerLoading && (
        <p className="text-sm text-gray-500 mb-4 text-center">
          📷 Loading scanner...
        </p>
      )}

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">
          Scanned Engine Number
        </label>
        <input
          type="text"
          value={engineNumber}
          className="w-full border rounded px-3 py-2 bg-green-100 text-green-800"
          onChange={(e) => setEngineNumber(e.target.value)}
        />

        {/* Optional: show validation error if needed */}
        {errors.engineNumber && (
          <p className="text-red-600 text-sm mt-1">{errors.engineNumber}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <select
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
          </select>
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Buyer Name</label>
          <input
            type="text"
            value={form.buyerName}
            onChange={(e) => handleChange("buyerName", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.buyerName && (
            <p className="text-red-600 text-sm mt-1">{errors.buyerName}</p>
          )}
        </div>

        {/* Buyer Phone Number */}
        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="tel"
            maxLength={11}
            value={form.phone}
            onChange={(e) =>
              handleChange(
                "phone",
                e.target.value.replace(/\D/g, "").slice(0, 11)
              )
            }
            className="w-full border rounded px-3 py-2"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">State</label>
          <select
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-600 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Dealer</label>
          <select
            value={form.dealer}
            onChange={(e) => handleChange("dealer", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Dealer</option>
            {dealers.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.dealer && (
            <p className="text-red-600 text-sm mt-1">{errors.dealer}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Purchase Date</label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]} // today's date
            value={form.purchaseDate}
            onChange={(e) => handleChange("purchaseDate", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.purchaseDate && (
            <p className="text-red-600 text-sm mt-1">{errors.purchaseDate}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">
            Usage: Private or Commercial (Okada)
          </label>
          <select
            value={form.usage}
            onChange={(e) => handleChange("usage", e.target.value)}
            className="w-full border rounded px-3 py-2"
            aria-placeholder="Select Usage"
          >
            <option value="">Select Usage</option>
            <option value="Private">Private</option>
            <option value="Commercial - Okada">Commercial (Okada)</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">End-User (Optional)</label>
          <input
            type="text"
            value={form.endUser}
            onChange={(e) => handleChange("endUser", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* End-User Phone Number */}
        <div>
          <label className="block font-medium">End-User Phone (Optional)</label>
          <input
            type="tel"
            maxLength={11}
            value={form.endUserPhone}
            onChange={(e) =>
              handleChange(
                "endUserPhone",
                e.target.value.replace(/\D/g, "").slice(0, 11)
              )
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Model</label>
          <select
            value={form.model}
            onChange={(e) => {
              handleChange("model", e.target.value);
              handleChange("variant", "");
              handleChange("color", "");
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Model</option>
            {Object.keys(modelsWithDetails).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.model && (
            <p className="text-red-600 text-sm mt-1">{errors.model}</p>
          )}
        </div>

        {form.model && modelsWithDetails[form.model]?.variant && (
          <div>
            <label className="block font-medium">Variant</label>
            <select
              value={form.variant}
              onChange={(e) => handleChange("variant", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Variant</option>
              {modelsWithDetails[form.model].variant!.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {errors.variant && (
              <p className="text-red-600 text-sm mt-1">{errors.variant}</p>
            )}
          </div>
        )}

        {form.model && (
          <div>
            <label className="block font-medium">Color</label>
            <select
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Color</option>
              {modelsWithDetails[form.model].color.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.color && (
              <p className="text-red-600 text-sm mt-1">{errors.color}</p>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            if (!validateForm()) return;
            setShowPasswordModal(true);
          }}
          className={`w-full py-2 text-white rounded ${
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {errors.general && (
          <p className="text-red-600 text-sm mt-1">{errors.general}</p>
        )}
      </form>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
              🔐 Confirm with Password
            </h2>

            <input
              type={showPassword ? "text" : "password"}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="w-full border px-4 py-2 rounded mb-3"
            />

            <label className="flex items-center mb-4 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
                className="mr-2"
              />
              Show Password
            </label>

            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handlePasswordConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
            <h2 className="text-sm font-semibold text-green-700 mb-4">
              {successMessage}
            </h2>
            <button
              onClick={() => {
                setSuccessMessage("");
                setForm({
                  title: "",
                  buyerName: "",
                  phone: "",
                  state: "",
                  dealer: "",
                  purchaseDate: "",
                  usage: "",
                  endUser: "",
                  endUserPhone: "",
                  model: "",
                  variant: "",
                  color: "",
                  rimType: "",
                  startType: "",
                });
                setEngineNumber("");
                setScannerInput("");
                setScannerMode("none");
                setScanSuccess(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
