// src/routes/publicRoutes.tsx
import { RouteObject } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ConfirmEmail from "@/pages/auth/ConfirmEmail";
import Home from "@/pages/home/Home";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import UnauthGuard from "@/guards/UnauthGuard";
import MovieDetails from "@/pages/movie/MovieDetails";
import NotFound from "@/pages/error/NotFound";
import Movies from "@/pages/movie/Movies";
import TvShows from "@/pages/tv/TvShows";
import TvShowDetails from "@/pages/tv/TvShowDetails";
import Browse from "@/pages/browse/Browse";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/movies",
    element: <Movies />,
  },
  {
    path: "/movie/:id/details",
    element: <MovieDetails />,
  },
  {
    path: "/tv",
    element: <TvShows />,
  },
  {
    path: "/tv/:id/details",
    element: <TvShowDetails />,
  },
  {
    element: <UnauthGuard />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/confirm-email",
        element: <ConfirmEmail />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default publicRoutes;
