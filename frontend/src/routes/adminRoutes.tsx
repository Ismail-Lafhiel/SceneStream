import AdminGuard from "@/guards/AdminGuard";

// pages
import Dashboard from "@/pages/admin/Dashboard";
import CreateGenre from "@/pages/admin/genres/CreateGenre";
import Genres from "@/pages/admin/genres/Genres";
import CreateMovie from "@/pages/admin/movies/CreateMovie";
import Movies from "@/pages/admin/movies/Movies";
import CreateTvShow from "@/pages/admin/tvshows/CreateTvShow";
import TVShows from "@/pages/admin/tvshows/Tvshows";
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
        path: "movies",
        element: <Movies />,
      },
      {
        path: "movies/create",
        element: <CreateMovie />,
      },
      {
        path: "tvshows",
        element: <TVShows />,
      },
      {
        path: "tvshows/create",
        element: <CreateTvShow />,
      },
      {
        path: "genres",
        element: <Genres />,
      },
      {
        path: "genres/create",
        element: <CreateGenre />,
      },
    ],
  },
];

export default adminRoutes;
