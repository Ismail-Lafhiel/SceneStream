// src/routes/publicRoutes.tsx
import { RouteObject } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ConfirmEmail from "@/pages/auth/ConfirmEmail";
import Home from "@/pages/home/Home";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import GuestGuard from "@/guards/AuthGuard";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <GuestGuard />,
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
];

export default publicRoutes;
