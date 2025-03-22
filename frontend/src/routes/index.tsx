import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import publicRoutes from "@/routes/publicRoutes";
import privateRoutes from "@/routes/privateRoutes";
import adminRoutes from "@/routes/adminRoutes";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/layout/AdminLayout";
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
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      ...adminRoutes,
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;