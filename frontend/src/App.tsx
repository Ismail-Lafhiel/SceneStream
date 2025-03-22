import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "@/routes";
import { CheckCircle, XCircle } from "lucide-react";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "rounded-lg shadow-md border border-slate-200 dark:border-slate-700",
          duration: 2000,
          style: {},
          success: {
            icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
            className:
              "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
          },
          error: {
            icon: <XCircle className="w-4 h-4 text-red-500" />,
            className:
              "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
          },
        }}
      />
    </>
  );
};

export default App;
