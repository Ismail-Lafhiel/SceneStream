import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Loading } from "@/components/common/Loading";

const AdminGuard = () => {
  const { isAuthenticated, isAdmin, checkAdminStatus } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (isAuthenticated) {
        await checkAdminStatus();
      }
      setIsChecking(false);
    };

    verifyAdmin();
  }, [isAuthenticated, checkAdminStatus]);

  if (isChecking) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;