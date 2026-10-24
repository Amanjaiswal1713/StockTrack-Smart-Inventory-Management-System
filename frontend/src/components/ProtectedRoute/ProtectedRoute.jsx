import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute() {
  const location = useLocation();

  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        Loading StockTrack...
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
