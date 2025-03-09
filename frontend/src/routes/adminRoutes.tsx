import AdminGuard from "@/guards/AdminGuard";

// pages
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";

const adminRoutes = [
  {
    element: <AdminGuard />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
];

export default adminRoutes;
