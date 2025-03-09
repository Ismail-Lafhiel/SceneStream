import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useDarkMode } from "@/contexts/DarkModeContext";

const AdminLayout = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div
            className={`h-full ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
