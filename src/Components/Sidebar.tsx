import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Warehouse,
  FileText,
  Users,
  Boxes,
  ShieldCheck,
  List,
  Receipt,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Cart", path: "/cart", icon: ShoppingCart },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Inventory", path: "/inventory", icon: Warehouse },
  { name: "GRN", path: "/grn", icon: FileText },
  { name: "Lead Generation", path: "/leads", icon: Users },
  { name: "Stock Management", path: "/stock", icon: Boxes },
  { name: "Warranty Registration", path: "/warranty", icon: ShieldCheck },
  { name: "Price List", path: "/price-list", icon: List },
  { name: "Invoice", path: "/invoice", icon: Receipt },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens/session here if required
    localStorage.clear();

    // Navigate to login page
    navigate("/");
  };

  return (
    <aside className="h-screen w-[280px] bg-gradient-to-b from-[#050b16] via-[#060f1f] to-[#040914] text-gray-300 flex flex-col border-r border-[#0b1f33]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#0b1f33]">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#00c2ff] to-[#005cff] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">▣</span>
        </div>
        <div>
          <h1 className="text-white font-semibold text-lg leading-tight">
            DMS Portal
          </h1>
          <p className="text-xs text-gray-400">Distributor Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-[#0ea5e9]/40 scrollbar-track-transparent">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-[#0ea5e9]/30 to-[#0ea5e9]/10 text-white shadow-md"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#0b1f33]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#00c2ff] to-[#7c3aed] flex items-center justify-center shadow-md">
            <User size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-white font-semibold">John Distributor</p>
            <p className="text-xs text-gray-400">Distributor</p>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full rounded-xl flex items-center gap-2 justify-center"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
