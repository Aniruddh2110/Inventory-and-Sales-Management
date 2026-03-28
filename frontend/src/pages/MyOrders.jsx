import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/my")
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        );
      case "in progress":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13"/>
            <path d="M16 8h5l3 3v5h-2M16 16h2"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        );
      case "delivered":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="M22 4L12 14.01l-3-3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#f59e0b";
      case "in progress": return "#3b82f6";
      case "delivered": return "#10b981";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="my-orders-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="my-orders-container">
        <div className="orders-header">
          <h2>My Orders</h2>
          <span className="orders-count">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h3>No orders</h3>
            <p>Start shopping to see orders </p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    
                    <span>Order #{order._id.slice(-8)}</span>
                  </div>
                  <div
    className="order-status"
    style={{
      background: `${getStatusColor(order.status)}20`,
      color: getStatusColor(order.status)
    }}
  >
    {getStatusIcon(order.status)}
    <span>
      {order.status === 'in progress'
        ? 'In Progress'
        : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
    </span>
  </div>
                </div>
                

                <div className="order-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="item-image">
                        {item.product?.image ? (
                          <img src={`http://localhost:5000${item.product.image}`} alt={item.product.name} />
                        ) : (
                          <div className="no-image">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <path d="M21 15l-5-5L5 21"/>
                            </svg>
                          </div>
                        )}
                      </div>
                     <div className="item-content">
  <div className="item-info">
    <h4>{item.product?.name || 'Product'}</h4>
    <p className="item-qty">Quantity: {item.quantity}</p>

  </div>
    <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">Total Amount</span>
                    <span className="total-amount">₹{order.total?.toLocaleString() || 0}</span>
                  </div>
                </div>
  
</div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
