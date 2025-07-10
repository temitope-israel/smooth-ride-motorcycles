import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart2,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center bg-red-700 text-white p-4">
        <span className="font-bold text-lg">Honda Admin</span>
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } md:block w-full md:w-64 bg-red-700 text-white flex flex-col justify-between md:h-screen`}
      >
        <div>
          <div className="hidden md:block px-6 py-4 font-bold text-xl border-b border-red-800">
            Honda Admin
          </div>
          <nav className="flex flex-col p-4 gap-2 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-800"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-800"
            >
              <BarChart2 size={16} /> Analytics
            </Link>
            <Link
              href="/admin/add-admin"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-800"
            >
              <UserPlus size={16} /> Add Admin
            </Link>
            <Link
              href="/admin/view-admins"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-800"
            >
              <UserPlus size={16} /> View Admin
            </Link>
            <Link
              href="/admin/add-dealer"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-800"
            >
              <Settings size={16} /> Add Dealer
            </Link>
            <Link
              href="/admin/view-dealers"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-800"
            >
              <Users size={16} /> View Dealers
            </Link>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("admin-auth");
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-2 px-4 py-3 bg-red-800 text-white hover:bg-red-900"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4 overflow-y-auto">{children}</main>
    </div>
  );
}
