import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "@/routes";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          duration: 3000,
          style: {
            background: "#1F2937",
            color: "#fff",
          },
          success: {
            icon: "🎉",
            style: {
              background: "#065F46",
            },
          },
          error: {
            icon: "❌",
            style: {
              background: "#991B1B",
            },
          },
        }}
      />
    </>
  );
};

export default App;
