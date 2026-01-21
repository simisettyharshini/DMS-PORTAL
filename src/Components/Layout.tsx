import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div className="flex-1 bg-[#020817] p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
