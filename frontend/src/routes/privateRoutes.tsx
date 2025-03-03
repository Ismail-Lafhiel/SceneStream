import AuthGuard from "@/guards/AuthGuard";
import Bookmarks from "@/pages/bookmark/Bookmarks";
import Profile from "@/pages/profile/Profile";

const privateRoutes = [
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/bookmarks",
        element: <Bookmarks />,
      },
    ],
  },
];

export default privateRoutes;
