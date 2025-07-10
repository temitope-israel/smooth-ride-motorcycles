import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  engineNumber: string;
  buyerName: string;
  title: string;
  phone: string;
  state: string;
  dealer: string;
  purchaseDate: string;
  endUser?: string;
  model: string;
  color: string;
}

export default function Admin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const dealers = Array.from(new Set(customers.map(c => c.dealer))).sort();
  const states = Array.from(new Set(customers.map(c => c.state))).sort();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/registrations");
        const data = await res.json();
        setCustomers(data);
        setFiltered(data);
      } catch (err) {
        setError("Failed to fetch customers.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = customers.filter((c) => {
      const matchSearch =
        c.engineNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.buyerName.toLowerCase().includes(search.toLowerCase());
      const matchDealer = selectedDealer ? c.dealer === selectedDealer : true;
      const matchState = selectedState ? c.state === selectedState : true;
      return matchSearch && matchDealer && matchState;
    });
    setFiltered(results);
  }, [search, selectedDealer, selectedState, customers]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          {/* 🔍 Filter Controls */}
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search by engine number or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/3"
            />
            <select
              value={selectedDealer}
              onChange={(e) => setSelectedDealer(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/4"
            >
              <option value="">All Dealers</option>
              {dealers.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/4"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 📊 Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Engine No</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Buyer</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Phone</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">State</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Dealer</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Model</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Color</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filtered.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-2">{c.engineNumber}</td>
                    <td className="px-4 py-2">{c.title} {c.buyerName}</td>
                    <td className="px-4 py-2">{c.phone}</td>
                    <td className="px-4 py-2">{c.state}</td>
                    <td className="px-4 py-2">{c.dealer}</td>
                    <td className="px-4 py-2">{new Date(c.purchaseDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{c.model}</td>
                    <td className="px-4 py-2">{c.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
