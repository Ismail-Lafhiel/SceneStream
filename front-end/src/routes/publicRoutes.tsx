import Login from "@/pages/auth/Login";
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
  // {
  //   path: "/register",
  //   element: <RegisterPage />,
  // },
];

export default publicRoutes;
