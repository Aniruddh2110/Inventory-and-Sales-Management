import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { getRole } from "../utils/auth";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const role = getRole();

  const load = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  // ✅ LOAD ONLY FOR ADMIN / STAFF
  useEffect(() => {
    if (role === "admin" || role === "staff") {
      load();
    }
  }, [role]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      load();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <>
      <div className="admin-page">
        <AdminSidebar />

        <div className="admin-content">
          <div className="orders-container">
            <h2>Order Management</h2>

            <div className="orders-grid">
              {orders.map(o => (
                <div key={o._id} className="order-box">
                  <div className="order-header">
                    <span>{o.orderedBy?.name || "Customer"}</span>

                    {/* ✅ SAFE STATUS BADGE */}
                    {o.status && (
                      <span
                        className={`badge ${o.status.replace(/ /g, "-")}`}
                      >
                        {o.status.charAt(0).toUpperCase() +
                          o.status.slice(1)}
                      </span>
                    )}
                  </div>

                  <div className="order-items">
                    {o.items.map(i => (
                      <div
                        key={i._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          {i.product?.name || "Product"} × {i.quantity}
                        </span>
                        <span>₹{i.product?.price || 0}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    {o.status === "pending" && (
                      <button
                        className="btn approve"
                        onClick={() =>
                          updateStatus(o._id, "in progress")
                        }
                      >
                        Start Processing
                      </button>
                    )}

                    {o.status === "in progress" && (
                      <button
                        className="btn approve"
                        onClick={() =>
                          updateStatus(o._id, "delivered")
                        }
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <p style={{ color: "#6b7280" }}>No orders found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
