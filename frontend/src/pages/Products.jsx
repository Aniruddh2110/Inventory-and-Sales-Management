import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { getCart, setCart } from "../utils/cart";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Fashion & Clothing",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Fitness",
    "Books & Stationery",
    "Toys & Games",
    "Automotive",
    "Health & Wellness",
    "Jwellary & Accessories",
    "Groceries & Food",
    "Pet Supplies"
  ];

  useEffect(() => {
    API.get("/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="products-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {toast.show && <Toast message={toast.message} type={toast.type} />}
      
      <div className="products-container">
        <div className="products-header">
          <h1>All Products</h1>
          <p>Explorer our collection</p>
        </div>

        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <h3>No products found</h3>
            <p>Try selecting a different category</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  {product.image ? (
                    <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                  ) : (
                    <div className="no-image-placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                  )}
                  {product.quantity < 10 && product.quantity > 0 && (
                    <span className="low-stock-badge">Only {product.quantity} left</span>
                  )}
                  {product.quantity === 0 && (
                    <span className="out-of-stock-badge">Out of Stock</span>
                  )}
                </div>

                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-footer">
                    <div className="price-section">
                      <span className="product-price">₹{product.price.toLocaleString()}</span>
                      <span className="stock-info">In Stock: {product.quantity}</span>
                    </div>
                    
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      Add to Cart
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
