import { useNavigate } from "react-router-dom";
import { getRole } from "../utils/auth";
import { getCart } from "../utils/cart";
import { useEffect, useState } from "react";
import "./Navbar.css";
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiList,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";


export default function Navbar() {
  const navigate = useNavigate();
  const role = getRole();
  const token = localStorage.getItem("token");
  const [cartCount, setCartCount] = useState(getCart().length);
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const update = () => setCartCount(getCart().length);
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <span className="brand-text">Flipify</span>
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          
        </div>

        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-menu ${open ? "active" : ""}`}>
          
          {/* Public (not logged in) */}
          {!token && (
            <>
              <button className="nav-link" onClick={() => navigate("/")}>
                <FiHome />
                <span>Home</span>
              </button>
              
              <button className="nav-link" onClick={() => navigate("/products")}>
               <FiBox />

                <span>Products</span>
              </button>
              
              <button className="nav-link cart-link" onClick={() => navigate("/cart")}>
                <FiShoppingBag />
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              <button className="nav-link nav-btn" onClick={() => navigate("/login")}>
                <FiLogIn />

                Login
              </button>
              
            </>
          )}

          {/* Customer */}
          {role === "customer" && (
            <>
              <button className="nav-link" onClick={() => navigate("/")}>
               <FiHome />

                <span>Home</span>
              </button>
              
              <button className="nav-link" onClick={() => navigate("/products")}>
                <FiBox />

                <span>Products</span>
              </button>
              
              <button className="nav-link cart-link" onClick={() => navigate("/cart")}>
                <FiShoppingBag />

                <span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              
              <button className="nav-link" onClick={() => navigate("/myorders")}>
                <FiList />

                <span>My Orders</span>
              </button>
              
              <button className="nav-link" onClick={() => navigate("/profile")}>
                <FiUser />

                <span>Profile</span>
              </button>
              
              <button className="nav-link logout-link" onClick={logout}>
                <FiLogIn />

                <span>Logout</span>
              </button>
            </>
          )}

          {/* Staff */}
          {role === "staff" && (
            <>
             <button className="nav-link" onClick={() => navigate("/admin/products")}>
                <span>Staff</span>
              </button>

              <button className="nav-link logout-link" onClick={logout}>
                <FiLogIn />

                <span>Logout</span>
              </button>
            </>
          )}

          {/* Admin */}
          {role === "admin" && (
            <>
              <button className="nav-link" onClick={() => navigate("/admin")}>
                <span>Admin</span>
              </button>
              
              <button className="nav-link logout-link" onClick={logout}>
               <FiLogIn />

                <span>Logout</span>
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
