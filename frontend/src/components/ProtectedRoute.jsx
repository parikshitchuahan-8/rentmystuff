import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="glass-panel rounded-[30px] p-8 text-center text-slate-300">
        Checking your session...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
