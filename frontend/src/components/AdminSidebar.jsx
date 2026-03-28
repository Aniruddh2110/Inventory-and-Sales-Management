import { useNavigate, useLocation } from "react-router-dom";
import { getRole } from "../utils/auth";
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiList,
  FiUsers,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  let menu = [];

  // STAFF MENU
  if (role === "staff") {
    menu = [
      { to: "/admin/products", label: "Products", icon: <FiBox /> },
      { to: "/orders", label: "Orders", icon: <FiList /> },
      { to: "/sales", label: "Sales", icon: <FiShoppingBag /> },
      { to: "/profile", label: "Profile", icon: <FiUser /> },
    ];
  }

  // ADMIN MENU
  if (role === "admin") {
    menu = [
      { to: "/admin", label: "Dashboard", icon: <FiHome /> },
      { to: "/admin/products", label: "Products", icon: <FiBox /> },
      { to: "/orders", label: "Orders", icon: <FiList /> },
      { to: "/sales", label: "Sales", icon: <FiShoppingBag /> },
      { to: "/profile", label: "Profile", icon: <FiUser /> },
      { to: "/admin/users", label: "Users", icon: <FiUsers /> },
    ];
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand" onClick={() => navigate("/admin")}>
        Inventory & Sales
      </div>

      <nav className="sidebar-menu">
        {menu.map(item => (
          <button
            key={item.to}
            className={location.pathname === item.to ? "active" : ""}
            onClick={() => navigate(item.to)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <FiLogOut />
        Logout
      </button>
    </aside>
  );
}
