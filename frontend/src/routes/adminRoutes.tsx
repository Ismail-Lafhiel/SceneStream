import AdminGuard from "@/guards/AdminGuard";

// pages
import Dashboard from "@/pages/admin/Dashboard";

const adminRoutes = [
  {
    element: <AdminGuard />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
];

export default adminRoutes;
