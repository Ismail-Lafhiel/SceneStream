import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import publicRoutes from "@/routes/publicRoutes";
// import privateRoutes from "@/routes/privateRoutes";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/notFound/NotFound";

const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      ...publicRoutes,
    //   ...privateRoutes,
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
