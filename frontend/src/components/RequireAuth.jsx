import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

export default function RequireAuth({ children }) {
  if (!getRole()) return <Navigate to="/login" />;
  return children;
}
