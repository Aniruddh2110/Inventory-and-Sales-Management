import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

export default function RequireStaff({ children }) {
  const role = getRole();
  if (role !== "admin" && role !== "staff") return <Navigate to="/" />;
  return children;
}
