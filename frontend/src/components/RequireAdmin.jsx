import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

export default function RequireAdmin({ children }) {
  if (getRole() !== "admin") return <Navigate to="/" />;
  return children;
}
