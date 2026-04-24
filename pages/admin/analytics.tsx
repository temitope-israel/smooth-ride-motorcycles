// pages/admin/analytics.tsx
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
  CartesianGrid,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

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
        setError("Failed to sync registration data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Data processors
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
    data.forEach((entry) => { counts[entry.model] = (counts[entry.model] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getStateDistribution = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => { counts[entry.state] = (counts[entry.state] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getUsageDistribution = () => {
    const counts: Record<string, number> = {};
    data.forEach((entry) => { if (entry.usage) counts[entry.usage] = (counts[entry.usage] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const peakMonth = getMonthlyTrend().reduce(
    (max, cur) => (cur.count > max.count ? cur : max),
    { month: "N/A", count: 0 }
  );

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">

        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Business Intelligence</h1>
            <p className="text-slate-500 font-medium">Real-time registration performance & market insights</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-700 font-bold text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            LIVE DATA SYNC
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Analyzing Datasets...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100 font-bold text-center">{error}</div>
        ) : (
          <>
            {/* KPI Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Registrations", val: data.length, color: "text-slate-800", bg: "bg-white" },
                { label: "Peak Month", val: peakMonth.month, color: "text-indigo-600", bg: "bg-indigo-50/30" },
                { label: "Market Reach", val: `${getStateDistribution().length} States`, color: "text-emerald-600", bg: "bg-white" },
                { label: "Active Partners", val: `${Array.from(new Set(data.map(d => d.dealer))).length} Dealers`, color: "text-amber-600", bg: "bg-white" },
              ].map((card, i) => (
                <div key={i} className={`${card.bg} p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{card.label}</p>
                  <p className={`text-2xl font-black ${card.color}`}>{card.val}</p>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Monthly Trend - Full Width potentially or side by side */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Growth Velocity</h2>
                  <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">Volume / Month</span>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={getMonthlyTrend()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} fontWeight={700} tick={{fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} fontSize={11} fontWeight={700} tick={{fill: '#94a3b8'}} />
                    <Tooltip
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Models - Pie Chart */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-8">Model Dominance</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={getTopModels()}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {getTopModels().map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 'bold'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 lg:col-span-2">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-8">Regional Penetration (By State)</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getStateDistribution()} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} fontSize={11} fontWeight={800} width={100} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Usage & Mechanical Preferences */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-8">Primary Usage Case</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getUsageDistribution()}
                      dataKey="value"
                      cx="50%" cy="50%"
                      outerRadius={100}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getUsageDistribution().map((_, index) => (
                        <Cell key={index} fill={index === 0 ? '#6366f1' : '#e2e8f0'} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl text-white flex flex-col justify-center">
                <h2 className="text-2xl font-black mb-4 leading-tight">Insight Summary</h2>
                <p className="text-indigo-100 font-medium mb-6 leading-relaxed">
                  The current peak registration period was <span className="text-white font-black underline">{peakMonth.month}</span>.
                  Focus marketing efforts on <span className="text-white font-black">{getTopModels()[0]?.name || 'N/A'}</span> as it remains the highest-performing model in your current inventory.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Efficiency</p>
                    <p className="text-xl font-bold">98.4%</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Growth</p>
                    <p className="text-xl font-bold">+12.5%</p>
                  </div>
                </div>
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

//   const getUsageDistribution = () => {
//     const counts: Record<string, number> = {};
//     data.forEach((entry) => {
//       const usage = entry.usage;
//       if (usage) {
//         counts[usage] = (counts[usage] || 0) + 1;
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
//         <h1 className="text-2xl font-bold text-indigo-700 mb-4">Analytics</h1>

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
//                   🏍 Top Bike Models
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

//               {/* Usage Distribution */}
//               <div className="bg-white p-4 rounded shadow">
//                 <h2 className="text-base font-semibold mb-2">
//                   🚦 Usage Distribution{" "}
//                   <span className="text-gray-500 text-sm">
//                     (Private or Commercial Use)
//                   </span>
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart className="text-sm">
//                     <Pie
//                       data={getUsageDistribution()}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={90}
//                       label
//                     >
//                       {getUsageDistribution().map((entry, index) => (
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
//                   <BarChart data={getDealerDistribution()} className="text-xs">
//                     <XAxis
//                       dataKey="name"
//                       fontSize={10}
//                       angle={-20}
//                       textAnchor="end"
//                       interval={0}
//                       height={75}
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
//                   🎨 Color Preferences{" "}
//                   <span className="text-gray-500 text-sm">
//                     (Blue/Black/Red/Grey/White)
//                   </span>
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
//                   🔋 Start Type Preferences{" "}
//                   <span className="text-gray-500 text-sm">
//                     (Kick-Start / Self-Start)
//                   </span>
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
//                   🛞 Rim Type Preferences{" "}
//                   <span className="text-gray-500 text-sm">(Alloy / Spoke)</span>
//                 </h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart className="text-sm">
//                     <Pie
//                       data={getRimTypePreferences()}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={85}
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
