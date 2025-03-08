import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import publicRoutes from "@/routes/publicRoutes";
import privateRoutes from "@/routes/privateRoutes";
import adminRoutes from "@/routes/adminRoutes";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/error/NotFound";
import Unauthorized from "@/components/unauthorized/Unauthorized";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      ...publicRoutes,
      ...privateRoutes,
      ...adminRoutes,
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;