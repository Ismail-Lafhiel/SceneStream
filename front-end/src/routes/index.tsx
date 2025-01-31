import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import privateRoutes from "./privateRoutes";
import Layout from "../components/Layout"; // Your main layout component
import NotFound from "../components/NotFound"; // 404 component

const router = createBrowserRouter([
  {
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
]);

export default router;
