import AuthGuard from "../guards/AuthGuard";

const privateRoutes = [
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];

export default privateRoutes;
