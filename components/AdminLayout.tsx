import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  LogOut,
  Bell,
  Menu,
  X,
  Settings,
  BarChart2,
  ShieldCheck,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/admin/unread-notification-count");
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Sidebar count fetch failed");
    }
  };

  useEffect(() => {
    fetchCount();
    // Refresh count every 30 seconds to keep it live
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { name: "Add Admin", href: "/admin/add-admin", icon: ShieldCheck },
    { name: "View Admins", href: "/admin/view-admins", icon: UserPlus },
    { name: "Add Dealer", href: "/admin/add-dealer", icon: Settings },
    { name: "View Dealers", href: "/admin/view-dealers", icon: Users },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center bg-indigo-900 text-white p-4 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black">H</div>
          <span className="font-bold tracking-tighter">HONDA ADMIN</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-indigo-800 rounded-lg transition-colors"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "fixed inset-0 z-40" : "hidden"
        } md:relative md:flex w-full md:w-64 bg-indigo-950 text-indigo-100 flex-col justify-between h-screen transition-all duration-300 border-r border-indigo-900`}
      >
        <div>
          {/* Logo Section */}
          <div className="hidden md:flex items-center gap-3 px-6 py-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-black text-white leading-none tracking-tight">SMOOTH RIDE</h1>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Management</span>
            </div>
          </div>

          <nav className="flex flex-col p-4 gap-1">
            <p className="px-3 text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 ml-1">Menu</p>

            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive(item.href)
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                    : "hover:bg-indigo-900/50 hover:text-white text-indigo-300"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive(item.href) ? 2.5 : 2} />
                {item.name}
              </Link>
            ))}

            <Link
              href="/admin/notifications"
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all mt-4 ${
                isActive("/admin/notifications")
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "hover:bg-indigo-900/50 hover:text-white text-indigo-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} strokeWidth={isActive("/admin/notifications") ? 2.5 : 2} />
                Notifications
              </div>

              {unreadCount > 0 && (
                <span className="flex items-center justify-center bg-rose-500 text-white text-[10px] font-black min-w-[20px] h-5 px-1.5 rounded-full animate-pulse shadow-lg shadow-rose-500/40">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-900/50">
          <button
            onClick={() => {
              localStorage.removeItem("admin-auth");
              window.location.href = "/admin/login";
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-indigo-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-bold transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Logout System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <style jsx global>{`
        /* Smooth scrolling for the main content area */
        main {
          scrollbar-width: thin;
          scrollbar-color: rgba(79, 70, 229, 0.2) transparent;
        }

        main::-webkit-scrollbar {
          width: 6px;
        }

        main::-webkit-scrollbar-thumb {
          background-color: rgba(79, 70, 229, 0.2);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
// import { ReactNode, useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   LayoutDashboard,
//   UserPlus,
//   Users,
//   LogOut,
//   Bell,
//   Menu,
//   X,
//   Settings,
//   BarChart2,
// } from "lucide-react";
// interface AdminLayoutProps {
//   children: ReactNode;
// }

// export default function AdminLayout({ children }: AdminLayoutProps) {
//   const [open, setOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const fetchCount = async () => {
//     const res = await fetch("/api/admin/unread-notification-count");
//     const data = await res.json();
//     setUnreadCount(data.count || 0);
//   };

// useEffect(() => {

//   fetchCount();
// }, []);


//   return (
//     <div className="max-h-screen flex flex-col md:flex-row">
//       {/* Mobile Header */}
//       <header className="md:hidden flex justify-between items-center bg-indigo-700 text-white p-4">
//         <span className="font-bold text-lg">Honda Admin</span>
//         <button onClick={() => setOpen(!open)}>
//           {open ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </header>

//       {/* Sidebar */}
//       <aside
//         className={`${
//           open ? "block" : "hidden"
//         } md:block w-full md:w-48 bg-indigo-700 text-white flex flex-col justify-between md:h-screen`}
//       >
//         <div>
//           <div className="hidden md:block px-6 py-4 font-bold text-xl border-b border-indigo-800">
//             Smooth-Ride  Admin
//           </div>
//           <nav className="flex flex-col p-4 gap-2 text-xs">
//             <Link
//               href="/admin"
//               className="flex items-center  gap-2 px-3 py-2 rounded hover:bg-indigo-800"
//             >
//               <LayoutDashboard size={16} /> Dashboard
//             </Link>
//             <Link
//               href="/admin/analytics"
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800"
//             >
//               <BarChart2 size={16} /> Analytics
//             </Link>
//             <Link
//               href="/admin/add-admin"
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800"
//             >
//               <UserPlus size={16} /> Add Admin
//             </Link>
//             <Link
//               href="/admin/view-admins"
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800"
//             >
//               <UserPlus size={16} /> View Admin
//             </Link>
//             <Link
//               href="/admin/add-dealer"
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800"
//             >
//               <Settings size={16} /> Add Dealer
//             </Link>
//             <Link
//               href="/admin/view-dealers"
//               className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800"
//             >
//               <Users size={16} /> View Dealers
//             </Link>

//             <Link href="/admin/notifications" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800 relative">
//             <Bell size={16}/> Notifications


//               {unreadCount > 0 && (
//                 <span className="absolute -top-0 -right-[-1] bg-indigo-600 text-white text-base px-1 rounded-full">
//                   {unreadCount}
//                 </span>
//               )}
//             </Link>
//           </nav>
//         </div>
//         <button
//           onClick={() => {
//             localStorage.removeItem("admin-auth");
//             window.location.href = "/admin/login";
//           }}
//           className="flex w-full items-center gap-5 px-8 py-3 bg-indigo-800 text-white hover:bg-indigo-900 text-xs"
//         >
//           <LogOut size={16} /> Logout
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-indigo-100 p-4 overflow-y-auto ">
//         {children}
//       </main>
//     </div>
//   );
// }
