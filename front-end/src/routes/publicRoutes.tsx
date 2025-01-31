// src/routes/publicRoutes.tsx
import { RouteObject } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ConfirmEmail from "@/pages/auth/ConfirmEmail";
import Home from "@/pages/home/Home";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
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
];

export default publicRoutes;
