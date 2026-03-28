import { useEffect, useState } from "react";
import API from "../services/api";
import { getRole } from "../utils/auth";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Profile.css";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const role = getRole();
  const isStaff = role === "staff";
  const isAdmin = role === "admin";


  useEffect(() => {
    API.get("/auth/me").then(res => {
      setName(res.data.name);
      setEmail(res.data.email);
    });
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const update = async () => {
    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    if (!email.trim()) {
      showToast("Email is required", "error");
      return;
    }

    if (!validateEmail(email)) {
      showToast("Please enter a valid email", "error");
      return;
    }

    if (password && password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (password && password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }
      await API.put("/auth/me", updateData);
      showToast("Profile updated successfully!", "success");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
    {isStaff ? (
      /* ================= STAFF VIEW ================= */
      <div className="admin-page">
        <AdminSidebar />

        <div className="admin-content">
          {toast.show && <Toast message={toast.message} type={toast.type} />}

          <div className="profile-page">
            <div className="profile-container">
              <div className="profile-header">
                <div className="profile-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h2>My Profile</h2>
                <p>Manage your account</p>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text"
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email"
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="password-section">
                  <h3>Change Password</h3>
                  <p className="section-description">
                    Leave blank if you want to keep current password as same
                  </p>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password"
                      placeholder="Enter new password (min 8 characters)" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input 
                      type="password"
                      placeholder="Confirm password" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button className="update-btn" onClick={update} disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (

      <>
    {isAdmin ? (
      /* ================= ADMIN VIEW ================= */
      <div className="admin-page">
        <AdminSidebar />

        <div className="admin-content">
          {toast.show && <Toast message={toast.message} type={toast.type} />}

          <div className="profile-page">
            <div className="profile-container">
              <div className="profile-header">
                <div className="profile-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h2>My Profile</h2>
                <p>Manage your account</p>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text"
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email"
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="password-section">
                  <h3>Change Password</h3>
                  <p className="section-description">
                    Leave blank if you want to keep current password as same
                  </p>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password"
                      placeholder="Enter new password (min 8 characters)" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input 
                      type="password"
                      placeholder="Confirm password" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button className="update-btn" onClick={update} disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <path d="M17 21v-8H7v8M7 3v5h8"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
/* ================= CUSTOMER VIEW ================= */
    <>
      <Navbar />
      {toast.show && <Toast message={toast.message} type={toast.type} />}
      
      <div className="profile-pages">
        <div className="profile-containers">
          <div className="profile-headers">
            <div className="profile-avatars">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>My Profile</h2>
            <p>Manage your account</p>
          </div>

          <div className="profile-forms">
            <div className="form-groups">
              <label>Name</label>
              <input 
                type="text"
                placeholder="Enter your name" 
                value={name} 
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-groups">
              <label>Email Address</label>
              <input 
                type="email"
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="password-sections">
              <h3>Change Password</h3>
              <p className="section-descriptions">Leave blank if you want to keep current password as same</p>
              
              <div className="form-groups">
                <label>New Password</label>
                <input 
                  type="password"
                  placeholder="Enter new password (min 8 characters)" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="form-groups">
                <label>Confirm Password</label>
                <input 
                  type="password"
                  placeholder="Confirm password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="update-btns" onClick={update} disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  Updating...
                </>
              ) : (
                <>
                Save Changes
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <path d="M17 21v-8H7v8M7 3v5h8"/>
                  </svg>
                  
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
     )}
  </>
    )}
  </>
  );
}
