import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, requireAuth = true }) {
  const token = localStorage.getItem("token");

  if (requireAuth && !token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!requireAuth && token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
