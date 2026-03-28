import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import "./Home.css";
import { getCart, setCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiCpu,
  FiFeather,
  FiTrendingUp,
  FiBookOpen,
} from "react-icons/fi";



export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();


  // Carousel slides
const slides = [
  {
    title: "Online Delivery",
    subtitle: "10% OFF on Online Delivery",
    image: "/hero/banner1.jpg",
  },
  {
    title: "Electronics Sale",
    subtitle: "Huge discounts on gadgets",
    image: "/hero/banner2.jpg",
  },
  {
    title: "Fashion Week Special",
    subtitle: "Exclusive designer collections",
    image: "/hero/banner3.jpg",
  },
];


 // Categories
const categories = [
  { name: "Home & Living", icon: <FiHome />, color: "#2563EB" },
  { name: "Fashion", icon: <FiShoppingBag />, color: "#ff0000" },
  { name: "Electronics", icon: <FiCpu />, color: "#6d0ee9" },
  { name: "Beauty", icon: <FiFeather />, color: "#EC4899" },
  { name: "Sports", icon: <FiTrendingUp />, color: "#16A34A" },
  { name: "Books", icon: <FiBookOpen />, color: "#f2ff00" },
];



  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Countdown timer
  useEffect(() => {
    const saleEndDate = new Date("2026-01-20T23:59:59").getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = saleEndDate - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      if (distance < 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const addToCart = (product) => {
    let cart = getCart();

    const existing = cart.find(i => i._id === product._id);

    if (existing) {
      if (existing.qty >= product.quantity) {
        showToast("No more stock available", "error");
        return;
      }
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    setCart(cart);
    showToast(`${product.name} added to cart!`, "success");
  };

  const groupedProducts = {};
  products.forEach(product => {
    const category = product.category || "Other";
    if (!groupedProducts[category]) {
      groupedProducts[category] = [];
    }
    groupedProducts[category].push(product);
  });

  return (
    <>
      <Navbar />
      {toast.show && <Toast message={toast.message} type={toast.type} />}
      
      <div className="hero-carousel">
  {slides.map((slide, index) => (
    <div
      key={index}
      className={`hero-slide ${index === currentSlide ? "active" : ""}`}
    >
      {/* Background Image */}
      <img src={slide.image} alt="" className="hero-bg" />

      {/* Content */}
      <div className="hero-content">
        <h1>{slide.title}</h1>
        <p>{slide.subtitle}</p>
        <button className="hero-btn">Explorer Now</button>
      </div>
    </div>
  ))}

  <button className="carousel-arrow left" onClick={() => setCurrentSlide(
  currentSlide === 0 ? slides.length - 1 : currentSlide - 1
)}>
  <span>‹</span>
</button>

<button className="carousel-arrow right" onClick={() => setCurrentSlide(
  currentSlide === slides.length - 1 ? 0 : currentSlide + 1
)}>
  <span>›</span>
</button>


  {/* DOTS */}
  <div className="carousel-dots">
    {slides.map((_, index) => (
      <span
        key={index}
        className={`dot ${index === currentSlide ? "active" : ""}`}
        onClick={() => setCurrentSlide(index)}
      />
    ))}
  </div>
</div>

{/* Banner Advertisement */}
        <section className="ad-banner">
          <div className="ad-content">
            <div className="ad-text">
              <span className="ad-badge">EXCLUSIVE OFFER</span>
              <h2>Get Premium Membership</h2>
              <p>Free shipping, unlock exclusive deals, and early access to sales</p>
              <button className="ad-btn">Join Now</button>
            </div>
            <div className="ad-visual">
              <div className="floating-element element-1">🎁</div>
              <div className="floating-element element-2">✨</div>
              <div className="floating-element element-3">🚀</div>
            </div>
          </div>
        </section>

      {/* Categories */}
<div className="home-container">
  <section className="categories-section">
    <h2 className="section-title">Category</h2>

    <div className="categories-grid">
      {categories.map((cat, index) => (
        <button
          key={index}
          className="category-card"
          style={{ borderColor: cat.color }}
          onClick={() =>
            navigate(`/products?category=${encodeURIComponent(cat.name)}`)
          }
        >
          <div
            className="category-icon"
            style={{ background: cat.color }}
          >
            {cat.icon}
          </div>

          <h3>{cat.name}</h3>
        </button>
      ))}
    </div>
        </section>

        {/* Products by Category */}
        {Object.keys(groupedProducts).map((category) => (
          <section key={category} className="products-section">
            <div className="section-header">
              <h2 className="section-title">{category}</h2>
              <a href="#" className="view-all">View All →</a>
            </div>
            <div className="products-grid">
              {groupedProducts[category].slice(0, 4).map(p => (
                <div key={p._id} className="product-card">
                  <div className="product-badge">NEW</div>
                  <div className="product-image">
                    {p.image ? (
                      <img src={`http://localhost:5000${p.image}`} alt={p.name} />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                        <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <div className="product-rating">
                      <span className="stars">★★★★☆</span>
                      <span className="rating-count">(4.0)</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">₹{p.price}</span>
                      <span className="original-price">₹{Math.round(p.price * 1.3)}</span>
                      <span className="discount">79% OFF</span>
                    </div>
                    <p className="stock-info">
                      {p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock'}
                    </p>
                    <button 
                      className="add-to-cart-btn" 
                      onClick={() => addToCart(p)}
                      disabled={p.quantity === 0}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                        <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Features */}
        <section className="features-section">
          <div className="feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>24/7 Support</h3>
            <p>Always here to help</p>
          </div>
          <div className="feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
          <div className="feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Free Shipping</h3>
            <p>On orders above ₹999</p>
          </div>
                
        </section>
        
      </div>

      <Footer />
    </>
  );
}
