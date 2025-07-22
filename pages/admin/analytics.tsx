import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#4CAF50",
];

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/registrations");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMonthlyTrend = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      const month = new Date(entry.purchaseDate).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).map(([month, count]) => ({ month, count }));
  };

  const getTopModels = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      counts[entry.model] = (counts[entry.model] || 0) + 1;
    });
    return Object.entries(counts).map(([model, count]) => ({
      name: model,
      value: count,
    }));
  };

  const getStateDistribution = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      counts[entry.state] = (counts[entry.state] || 0) + 1;
    });
    return Object.entries(counts).map(([state, count]) => ({
      name: state,
      value: count,
    }));
  };

  const getDealerDistribution = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      counts[entry.dealer] = (counts[entry.dealer] || 0) + 1;
    });
    return Object.entries(counts).map(([dealer, count]) => ({
      name: dealer,
      value: count,
    }));
  };

  const getColorPreferences = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      counts[entry.color] = (counts[entry.color] || 0) + 1;
    });
    return Object.entries(counts).map(([color, value]) => ({
      name: color,
      value,
    }));
  };

  const getStartTypePreferences = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      const type = entry.startType;
      if (type) {
        counts[type] = (counts[type] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getRimTypePreferences = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      const rim = entry.rimType;
      if (rim) {
        counts[rim] = (counts[rim] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getUsageDistribution = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => {
      const usage = entry.usage;
      if (usage) {
        counts[usage] = (counts[usage] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const peakMonth = getMonthlyTrend().reduce(
    (max, cur) => (cur.count > max.count ? cur : max),
    { month: "", count: 0 }
  );

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Analytics</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-500 text-sm">Total Registrations</p>
                <p className="text-2xl font-bold text-red-700">{data.length}</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getMonthlyTrend().find(
                    (t) =>
                      t.month ===
                      new Date().toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                      })
                  )?.count || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-500 text-sm">Unique Dealers</p>
                <p className="text-2xl font-bold text-green-600">
                  {getDealerDistribution().length}
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <p className="text-gray-500 text-sm">States Covered</p>
                <p className="text-2xl font-bold text-purple-600">
                  {getStateDistribution().length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Trends */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">
                  📊 Monthly Registration Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getMonthlyTrend()} className="text-sm">
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-base text-center mt-2 text-gray-500">
                  📈 Peak Registration: <strong>{peakMonth.month}</strong> (
                  {peakMonth.count})
                </p>
              </div>

              {/* Top Models */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">
                  🏍 Top Bike Models
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart className="text-sm">
                    <Pie
                      data={getTopModels()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {getTopModels().map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Usage Distribution */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">
                  🚦 Usage Distribution{" "}
                  <span className="text-gray-500 text-sm">
                    (Private or Commercial Use)
                  </span>
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart className="text-sm">
                    <Pie
                      data={getUsageDistribution()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {getUsageDistribution().map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* State Distribution */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">
                  📍 Registrations by State
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getStateDistribution()} className="text-sm">
                    <XAxis
                      dataKey="name"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={60}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4B5563" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Dealers */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">🏪 Top Dealers</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getDealerDistribution()} className="text-xs">
                    <XAxis
                      dataKey="name"
                      fontSize={10}
                      angle={-20}
                      textAnchor="end"
                      interval={0}
                      height={75}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Color Preferences */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">
                  🎨 Color Preferences{" "}
                  <span className="text-gray-500 text-sm">
                    (Blue/Black/Red/Grey/White)
                  </span>
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart className="text-sm">
                    <Pie
                      data={getColorPreferences()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {getColorPreferences().map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Start Type Preferences */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">
                  🔋 Start Type Preferences{" "}
                  <span className="text-gray-500 text-sm">
                    (Kick-Start / Self-Start)
                  </span>
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart className="text-sm">
                    <Pie
                      data={getStartTypePreferences()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {getStartTypePreferences().map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Rim Type Preferences */}
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-2">
                  🛞 Rim Type Preferences{" "}
                  <span className="text-gray-500 text-sm">(Alloy / Spoke)</span>
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart className="text-sm">
                    <Pie
                      data={getRimTypePreferences()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label
                    >
                      {getRimTypePreferences().map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
// import { useEffect, useState } from "react";
// import AdminLayout from "@/components/AdminLayout";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// const COLORS = [
//   "#0088FE",
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#AA336A",
//   "#4CAF50",
// ];

// export default function AnalyticsPage() {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/registrations");
//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         setError("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getMonthlyTrend = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       const month = new Date(entry.purchaseDate).toLocaleString("default", {
//         month: "short",
//         year: "numeric",
//       });
//       counts[month] = (counts[month] || 0) + 1;
//     });
//     return Object.entries(counts).map(([month, count]) => ({ month, count }));
//   };

//   const getTopModels = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       counts[entry.model] = (counts[entry.model] || 0) + 1;
//     });
//     return Object.entries(counts).map(([model, count]) => ({
//       name: model,
//       value: count,
//     }));
//   };

//   const getStateDistribution = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       counts[entry.state] = (counts[entry.state] || 0) + 1;
//     });
//     return Object.entries(counts).map(([state, count]) => ({
//       name: state,
//       value: count,
//     }));
//   };

//   const getDealerDistribution = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       counts[entry.dealer] = (counts[entry.dealer] || 0) + 1;
//     });
//     return Object.entries(counts).map(([dealer, count]) => ({
//       name: dealer,
//       value: count,
//     }));
//   };

//   const getColorPreferences = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       counts[entry.color] = (counts[entry.color] || 0) + 1;
//     });
//     return Object.entries(counts).map(([color, value]) => ({
//       name: color,
//       value,
//     }));
//   };

//   const getStartTypePreferences = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       const type = entry.startType;
//       if (type) {
//         counts[type] = (counts[type] || 0) + 1;
//       }
//     });
//     return Object.entries(counts).map(([name, value]) => ({ name, value }));
//   };

//   const getRimTypePreferences = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       const rim = entry.rimType;
//       if (rim) {
//         counts[rim] = (counts[rim] || 0) + 1;
//       }
//     });
//     return Object.entries(counts).map(([name, value]) => ({ name, value }));
//   };

//   const peakMonth = getMonthlyTrend().reduce(
//     (max, cur) => (cur.count > max.count ? cur : max),
//     { month: "", count: 0 }
//   );

//   return (
//     <AdminLayout>
//       <div className="p-4">
//         <h1 className="text-2xl font-bold text-red-700 mb-4">Analytics</h1>

//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p className="text-red-600">{error}</p>
//         ) : (
//           <>
//             {/* Summary Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//               <div className="bg-white p-4 rounded shadow text-center">
//                 <p className="text-gray-500 text-sm">Total Registrations</p>
//                 <p className="text-2xl font-bold text-red-700">{data.length}</p>
//               </div>
//               <div className="bg-white p-4 rounded shadow text-center">
//                 <p className="text-gray-500 text-sm">This Month</p>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {getMonthlyTrend().find(
//                     (t) =>
//                       t.month ===
//                       new Date().toLocaleString("default", {
//                         month: "short",
//                         year: "numeric",
//                       })
//                   )?.count || 0}
//                 </p>
//               </div>
//               <div className="bg-white p-4 rounded shadow text-center">
//                 <p className="text-gray-500 text-sm">Unique Dealers</p>
//                 <p className="text-2xl font-bold text-green-600">
//                   {getDealerDistribution().length}
//                 </p>
//               </div>
//               <div className="bg-white p-4 rounded shadow text-center">
//                 <p className="text-gray-500 text-sm">States Covered</p>
//                 <p className="text-2xl font-bold text-purple-600">
//                   {getStateDistribution().length}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Monthly Trends */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">
//                   📊 Monthly Registration Trend
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={getMonthlyTrend()} className="text-sm">
//                     <XAxis dataKey="month" fontSize={12} />
//                     <YAxis allowDecimals={false} fontSize={12} />
//                     <Tooltip />
//                     <Bar dataKey="count" fill="#EF4444" />
//                   </BarChart>
//                 </ResponsiveContainer>
//                 <p className="text-base text-center mt-2 text-gray-500">
//                   📈 Peak Registration: <strong>{peakMonth.month}</strong> (
//                   {peakMonth.count})
//                 </p>
//               </div>

//               {/* Top Models */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">
//                   🏍️ Top Bike Models
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart className="text-sm">
//                     <Pie
//                       data={getTopModels()}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={90}
//                       label
//                     >
//                       {getTopModels().map((entry, index) => (
//                         <Cell
//                           key={index}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* State Distribution */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">
//                   📍 Registrations by State
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={getStateDistribution()} className="text-sm">
//                     <XAxis
//                       dataKey="name"
//                       fontSize={10}
//                       angle={-45}
//                       textAnchor="end"
//                       interval={0}
//                       height={60}
//                     />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Bar dataKey="value" fill="#4B5563" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Dealers */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">🏪 Top Dealers</h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={getDealerDistribution()} className="text-sm">
//                     <XAxis
//                       dataKey="name"
//                       fontSize={11}
//                       angle={-30}
//                       textAnchor="end"
//                       interval={0}
//                       height={50}
//                     />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Bar dataKey="value" fill="#10B981" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Color Preferences */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">
//                   🎨 Color Preferences
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart className="text-sm">
//                     <Pie
//                       data={getColorPreferences()}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={90}
//                       label
//                     >
//                       {getColorPreferences().map((entry, index) => (
//                         <Cell
//                           key={index}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Start Type Preferences */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">
//                   🔋 Start Type Preferences
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart className="text-sm">
//                     <Pie
//                       data={getStartTypePreferences()}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={90}
//                       label
//                     >
//                       {getStartTypePreferences().map((entry, index) => (
//                         <Cell
//                           key={index}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Rim Type Preferences */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">
//                   🛞 Rim Type Preferences
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart className="text-sm">
//                     <Pie
//                       data={getRimTypePreferences()}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={90}
//                       label
//                     >
//                       {getRimTypePreferences().map((entry, index) => (
//                         <Cell
//                           key={index}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }
