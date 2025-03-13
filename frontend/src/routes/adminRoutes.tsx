import AdminGuard from "@/guards/AdminGuard";

// pages
import Dashboard from "@/pages/admin/Dashboard";
import CreateMovie from "@/pages/admin/movies/CreateMovie";
import CreateTvShow from "@/pages/admin/tvshows/CreateTvShow";
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
      {
        path: "tvshows/create",
        element: <CreateTvShow  />,
      },
    ],
  },
];

export default adminRoutes;
