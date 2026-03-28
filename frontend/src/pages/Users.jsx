import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import Toast from "../components/Toast";
import "./Users.css";

export default function Users() {
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showAddStaff, setShowAddStaff] = useState(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const load = () => {
    API.get("/users/staff").then(res => setStaff(res.data)).catch(() => {});
    API.get("/users/customers").then(res => setCustomers(res.data)).catch(() => {});
  };

  useEffect(load, []);

  const toggleStaffStatus = async (staffId, currentStatus) => {
    try {
      await API.put(`/users/staff/${staffId}/toggle-status`);
      showToast(`Staff ${currentStatus ? 'disabled' : 'enabled'} successfully`, "success");
      load();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update staff status", "error");
    }
  };

  const addStaff = async () => {
    if (!name || !email || !password) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register-staff", { name, email, password });
showToast("Staff member created successfully!", "success");

setName("");
setEmail("");
setPassword("");
setShowAddStaff(false); // 👈 ADD THIS
load();

    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create staff", "error");
    } finally {
      setLoading(false);
    }
  };

return (
  <>
    <div className="admin-page">
      <AdminSidebar />

      <div className="admin-content">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToast({ show: false, message: "", type: "" })
            }
          />
        )}

        <div className="users-container">
          <div className="users-header">
            <h2>User Management</h2>
            <button
              className="add-user-btn"
              onClick={() => setShowAddStaff(true)}
            >
              + Add Staff
            </button>
          </div>

          <div className="users-header" style={{ marginTop: "30px" }}>
  <p className="subtitle">View Staff</p>
</div>

          {/* ADD STAFF MODAL */}
          {showAddStaff && (
            <div
              className="modal-overlay"
              onClick={() => setShowAddStaff(false)}
            >
              <div
                className="add-staff-section modal-form"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="heading-with-icon">
                  Add New Staff
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="16" y1="11" x2="22" y2="11" />
                  </svg>
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="staff@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    className="add-staff-btn"
                    onClick={addStaff}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "+ Add Staff"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Staff List */}
        <div className={`users-section ${showAddStaff ? "blurred" : ""}`}>
          <h3 className="section-heading">
  <span className="heading-text">Staffs</span>

  <svg
    className="heading-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {/* Staff / Users icon */}
    <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <circle cx="17" cy="7" r="3" />
  </svg>

  
</h3>


          <div className="users-list">
            {staff.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                <p>No staff  yet</p>
              </div>
            ) : (
              staff.map(u => (
                <div key={u._id} className={`user-card ${!u.isActive ? 'disabled' : ''}`}>
                  <div className="user-avatar staff">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="user-info">
                    <h4>{u.name}</h4>
                    <p>{u.email}</p>
                    {!u.isActive && <span className="status-text disabled">Account Disabled</span>}
                  </div>
                  <div className="user-actions">
                    <span className={`role-badge staff ${!u.isActive ? 'disabled' : ''}`}>Staff</span>
                    <button 
                      className={`toggle-btn ${u.isActive ? 'disable' : 'enable'}`}
                      onClick={() => toggleStaffStatus(u._id, u.isActive)}
                      title={u.isActive ? 'Disable Access' : 'Enable Access'}
                    >
                      {u.isActive ? (
                        <>
  Disable
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
</>

                      ) : (
                       <>
  Enable
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
</>

                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

            <div className="users-header" style={{ marginTop: "30px" }}>
  <p className="subtitle">View Customers</p>
</div>

        {/* Customers List */}
        <div className="users-section">
          <h3 className="section-heading">
  <span className="heading-text">Customers</span>

  <svg
    className="heading-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {/* Single user icon */}
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>

  
</h3>


          <div className="users-list">
            {customers.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                <p>No customers yet</p>
              </div>
            ) : (
              customers.map(u => (
                <div key={u._id} className="user-card">
                  <div className="user-avatar customer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="user-info">
                    <h4>{u.name}</h4>
                    <p>{u.email}</p>
                  </div>
                  <span className="role-badge customer">Customer</span>
                </div>
              ))
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  </>
);
}
