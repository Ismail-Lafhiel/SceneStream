import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import publicRoutes from "@/routes/publicRoutes";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/error/NotFound";
import privateRoutes from "@/routes/privateRoutes";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      ...publicRoutes,
      ...privateRoutes,
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
