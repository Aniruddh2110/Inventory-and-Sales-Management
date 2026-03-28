import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0 });
  const [orders, setOrders] = useState({ pending: 0, totalOrders: 0 });
  const [users, setUsers] = useState({ customers: 0, staff: 0 });
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get("/sales/stats"),
      API.get("/orders/stats"),
      API.get("/users/stats"),
      API.get("/products"),
    ])
      .then(([sales, orders, users, products]) => {
        setRevenue(sales.data.revenue);
        setOrders(orders.data);
        setUsers(users.data);
        setStats({ products: products.data.length });
        setLowStockProducts(products.data.filter(p => p.quantity < 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="alert-section">
            <div className="alert-header">
              <div className="alert-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <h3>Low Stock Alert</h3>
                <p>{lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock</p>
              </div>
            </div>
            <div className="alert-products">
              {lowStockProducts.map(product => (
                <div key={product._id} className="alert-product-card">
                  <div className="alert-product-info">
                    {product.image ? (
                      <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                    ) : (
                      <div className="alert-no-image">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                          <path d="M21 15l-5-5L5 21"/>
                        </svg>
                      </div>
                    )}
                    <div className="alert-product-details">
                      <h4>{product.name}</h4>
                      <span className="alert-category">{product.category}</span>
                    </div>
                  </div>
                  <div className="alert-stock-info">
                    <span className={`stock-badge ${product.quantity === 0 ? 'out' : 'low'}`}>
                      {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} left`}
                    </span>
                    <button className="restock-btn" onClick={() => navigate('/admin/products')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Add Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="stats-grid">
  <div className="stat-card blue">
    <div className="stat-icon">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <path d="M3.3 7L12 12l8.7-5"/>
        <path d="M12 22V12"/>
      </svg>
    </div>

    <div className="stat-content">
      <p className="stat-label">Total Products</p>
      <h3 className="stat-value">{stats?.products || 0}</h3>
    </div>
  </div>

          <div className="stat-card purple">
  <div className="stat-icon">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1v22"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  </div>

  <div className="stat-content">
    <p className="stat-label">Total Revenue</p>
    <h3 className="stat-value">₹{(revenue || 0).toLocaleString()}</h3>
  </div>
</div>

         
          <div className="stat-card green">
    <div className="stat-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2h6a2 2 0 012 2v2H7V4a2 2 0 012-2z"/>
        <path d="M7 6h10v14a2 2 0 01-2 2H9a2 2 0 01-2-2z"/>
        <path d="M9 10h6M9 14h6"/>
      </svg>
    </div>
    <div className="stat-content">
      <p className="stat-label">Total Orders</p>
      <h3 className="stat-value">{orders?.totalOrders || 0}</h3>
    </div>
  </div>

  {/* Pending Orders */}
  <div className="stat-card yellow">
    <div className="stat-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    </div>
    <div className="stat-content">
      <p className="stat-label">Pending Orders</p>
      <h3 className="stat-value">{orders?.pending || 0}</h3>
    </div>
  </div>

  {/* Customers */}
  <div className="stat-card orange">
    <div className="stat-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"/>
        <path d="M1 21v-2a4 4 0 014-4h8"/>
        <circle cx="17" cy="9" r="3"/>
        <path d="M21 21v-2a4 4 0 00-3-3.87"/>
      </svg>
    </div>
    <div className="stat-content">
      <p className="stat-label">Customers</p>
      <h3 className="stat-value">{users?.customers || 0}</h3>
    </div>
  </div>

  {/* Staff Members */}
  <div className="stat-card pink">
    <div className="stat-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5.5 21v-2a4.5 4.5 0 019 0v2"/>
        <path d="M16 3h5v5"/>
      </svg>
    </div>
    <div className="stat-content">
      <p className="stat-label">Staff Members</p>
      <h3 className="stat-value">{users?.staff || 0}</h3>
    </div>
  </div>
        </div>
      </div>
    </AdminLayout>
  );
}
