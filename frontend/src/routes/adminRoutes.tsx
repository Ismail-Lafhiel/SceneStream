import AdminGuard from "@/guards/AdminGuard";

// pages
import Dashboard from "@/pages/admin/Dashboard";

const adminRoutes = [
  {
    element: <AdminGuard />,
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
      },
    ],
  },
];

export default adminRoutes;
