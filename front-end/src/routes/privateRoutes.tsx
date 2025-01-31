// src/routes/privateRoutes.tsx
import AuthGuard from "@/guards/AuthGuard";
import Profile from "@/pages/profile/Profile";

const privateRoutes = [
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];

export default privateRoutes;
