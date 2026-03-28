import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Cart.css";
import { getCart, setCart } from "../utils/cart";
import LoginPromptModal from "../components/LoginPromptModal";
import Toast from "../components/Toast";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCartState] = useState(getCart());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    try {
      const items = cart.map(i => ({
        product: i._id,
        quantity: i.qty,
      }));

      await API.post("/orders", { items });
      showToast("Order placed successfully!", "success");
      localStorage.removeItem("cart");
      setCart([]);
      
      // Navigate to My Orders after brief delay
      setTimeout(() => {
        navigate("/myorders");
      }, 1500);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to place order", "error");
    }
  };

  const updateQty = (id, qty) => {
    let cartData = getCart();

    if (qty <= 0) {
      cartData = cartData.filter(i => i._id !== id);
    } else {
      const item = cartData.find(i => i._id === id);
      if (item) item.qty = qty;
    }

    setCart(cartData);        // update localStorage + event
    setCartState(cartData);   // update page
  };

  return (
    <>
      <Navbar />
      {toast.show && <Toast message={toast.message} type={toast.type} />}
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
      
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <span className="cart-count">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
            </svg>
            <h3>Empty cart</h3>
            <p>Looks like you haven't added anything yet</p>
            <button onClick={() => navigate("/")}>Start Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    {item.image ? (
                      <img src={`http://localhost:5000${item.image}`} alt={item.name} />
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

                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <p className="item-price">₹{item.price.toLocaleString()}</p>
                  </div>

                  <div className="qty-controls">
                    <button onClick={() => updateQty(item._id, item.qty - 1)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </button>
                  </div>

                  <div className="item-total">
                    <span className="total-label">Total</span>
                    <span className="total-price">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>

                  <button className="remove-btn" onClick={() => updateQty(item._id, 0)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              
              <button className="order-btn" onClick={placeOrder}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
