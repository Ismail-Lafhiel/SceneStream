import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/landing/Home";


const publicRoutes = [
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
];

export default publicRoutes;
