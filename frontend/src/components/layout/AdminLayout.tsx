import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useDarkMode } from "@/contexts/DarkModeContext";

const AdminLayout = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />

          {/* Footer */}
          <div className="mt-8 text-center py-6 border-t transition-colors duration-300 border-gray-200 dark:border-gray-700">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              © 2025 Movie Dashboard. All statistics updated as of{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
