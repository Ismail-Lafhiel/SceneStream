import AdminGuard from "@/guards/AdminGuard";

// pages
import Dashboard from "@/pages/admin/Dashboard";
import CreateMovie from "@/pages/admin/movies/CreateMovie";
import Users from "@/pages/admin/users/Users";

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
      {
        path: "movies/create",
        element: <CreateMovie  />,
      },
    ],
  },
];

export default adminRoutes;
