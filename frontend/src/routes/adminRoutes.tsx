import AdminGuard from "@/guards/AdminGuard";

// pages
import Dashboard from "@/pages/admin/Dashboard";
import CreateGenre from "@/pages/admin/genres/CreateGenre";
import GenreDetails from "@/pages/admin/genres/GenreDetails";
import Genres from "@/pages/admin/genres/Genres";
import UpdateGenre from "@/pages/admin/genres/UpdateGenre";
import CreateMovie from "@/pages/admin/movies/CreateMovie";
import MovieDetails from "@/pages/admin/movies/MovieDetails";
import Movies from "@/pages/admin/movies/Movies";
import UpdateMovie from "@/pages/admin/movies/UpdateMovie";
import CreateTvShow from "@/pages/admin/tvshows/CreateTvShow";
import TvShowDetails from "@/pages/admin/tvshows/TvshowDetails";
import TVShows from "@/pages/admin/tvshows/Tvshows";
import UpdateTvShow from "@/pages/admin/tvshows/UpdateTvshow";
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
      //movie routes
      {
        path: "movies",
        element: <Movies />,
      },
      {
        path: "movies/details/:id",
        element: <MovieDetails />,
      },
      {
        path: "movies/create",
        element: <CreateMovie />,
      },
      {
        path: "movies/edit/:id",
        element: <UpdateMovie />,
      },
      //tvshow routes
      {
        path: "tvshows",
        element: <TVShows />,
      },
      {
        path: "tvshows/details/:id",
        element: <TvShowDetails />,
      },
      {
        path: "tvshows/create",
        element: <CreateTvShow />,
      },
      {
        path: "tvshows/edit/:id",
        element: <UpdateTvShow />,
      },
      //genre routes
      {
        path: "genres",
        element: <Genres />,
      },
      {
        path: "genres/details/:id",
        element: <GenreDetails />,
      },
      {
        path: "genres/create",
        element: <CreateGenre />,
      },
      {
        path: "genres/edit/:id",
        element: <UpdateGenre />,
      },
    ],
  },
];

export default adminRoutes;
