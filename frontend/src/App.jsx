import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Sales from "./pages/Sales";
import Users from "./pages/Users";
import AdminProducts from "./pages/AdminProducts";

import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import RequireStaff from "./components/RequireStaff";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/myorders" element={<RequireAuth><MyOrders /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

        {/* Staff & Admin */}
        <Route path="/orders" element={<RequireStaff><Orders /></RequireStaff>} />
        <Route path="/admin/products" element={<RequireStaff><AdminProducts /></RequireStaff>} />
        <Route path="/sales" element={<RequireStaff><Sales /></RequireStaff>} />
        

        {/* Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/sales" element={<RequireAdmin><Sales /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><Users /></RequireAdmin>} />
        <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />


      </Routes>
    </BrowserRouter>
  );
}
