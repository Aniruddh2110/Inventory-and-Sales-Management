import { useEffect, useState } from "react";
import API from "../services/api";
import { getRole } from "../utils/auth";
import "./AdminProducts.css";
import AdminSidebar from "../components/AdminSidebar";
import Toast from "../components/Toast";


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", quantity: "", category: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingImages, setEditingImages] = useState({});
  const userRole = getRole();
  const isStaff = userRole === "staff";
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });
  setTimeout(() => {
    setToast({ show: false, message: "", type: "" });
  }, 3000);
};


  // Predefined categories
  const categories = [
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

  const load = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (productId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImages(prev => ({
          ...prev,
          [productId]: { file, preview: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

 const add = async () => {
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('quantity', form.quantity);
    formData.append('category', form.category);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    await API.post("/products", formData);
    showToast("Product added successfully");

    // RESET FORM
    setForm({ name: "", price: "", quantity: "", category: "" });
    setImageFile(null);
    setImagePreview(null);

    // CLOSE MODAL
    setShowAddForm(false);

    // REFRESH PRODUCT LIST
    await load();

    // OPTIONAL: Scroll to products list
    setTimeout(() => {
      document.querySelector(".products-list")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);

  } catch (error) {
    showToast(error.response?.data?.message || "Failed to add product", "error");
  }
};


  const updateField = (id, field, value) => {
    setProducts(prev =>
      prev.map(p => p._id === id ? { ...p, [field]: value } : p)
    );
  };

  const save = async (p) => {
    try {
      const formData = new FormData();
      formData.append('name', p.name);
      formData.append('price', p.price);
      formData.append('quantity', p.quantity);
      formData.append('category', p.category);

      // If there's a new image for this product
      if (editingImages[p._id]?.file) {
        formData.append('image', editingImages[p._id].file);
      }

      await API.put(`/products/${p._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast("Product updated successfully");

      // Clear the editing image for this product
      setEditingImages(prev => {
        const newState = { ...prev };
        delete newState[p._id];
        return newState;
      });

      load();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update product", "error");
    }
  };

  const del = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await API.delete(`/products/${id}`);
      showToast("Product deleted successfully");
      load();
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
    onClose={() => setToast({ show: false, message: "", type: "" })}
  />
)}

      <div className="ap-container">
        <div className="ap-header">
  <h2>Products Inventory</h2>

  {!isStaff && (
    <button className="add-product-top-btn" onClick={() => setShowAddForm(true)}>
      + Add Product
    </button>
  )}
</div>

        <p className="subtitle">{isStaff ? "Manage existing products" : ""}</p>

        {!isStaff && showAddForm && (
  <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
    <div className="ap-form modal-form" onClick={(e) => e.stopPropagation()}>

            <h3>Add Product Details</h3>
            <div className="form-row">
              <input 
                placeholder="Product Name" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <select 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="category-select"
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input 
                type="number"
                placeholder="Price" 
                value={form.price} 
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
              <input 
                type="number"
                placeholder="Quantity" 
                value={form.quantity} 
                onChange={e => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            
            <div className="image-upload-section">
              <label className="image-upload-label">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div className="upload-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {imageFile ? 'Change Image' : 'Upload Image'}
                </div>
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <button className="add-btn" onClick={add}>Add Product</button>
          </div>
          </div>
        )}

        <h3>{isStaff ? "Products" : "Existing Products List"}</h3>
        <div className={`products-list ${showAddForm ? "blurred" : ""}`}>

          {products.map(p => (
            <div key={p._id} className="product-row">
              <div className="product-image-section">
                {editingImages[p._id]?.preview ? (
                  <img src={editingImages[p._id].preview} alt={p.name} />
                ) : p.image ? (
                  <img src={`http://localhost:5000${p.image}`} alt={p.name} />
                ) : (
                  <div className="no-image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <path d="M21 15l-5-5L5 21" strokeWidth="2"/>
                    </svg>
                  </div>
                )}
                <label className="change-image-btn">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleEditImageChange(p._id, e)}
                    style={{ display: 'none' }}
                  />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              
              <div className="product-fields">
                <select 
                  value={p.category || ""} 
                  onChange={e => updateField(p._id, "category", e.target.value)}
                  className="category-select"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <input 
                  value={p.category || ""} 
                  onChange={e => updateField(p._id, "category", e.target.value)}
                  placeholder="Category"
                />
                <input 
                  type="number"
                  value={p.price} 
                  onChange={e => updateField(p._id, "price", e.target.value)}
                  placeholder="Price"
                />
                <input 
                  type="number"
                  value={p.quantity} 
                  onChange={e => updateField(p._id, "quantity", e.target.value)}
                  placeholder="Quantity"
                />
              </div>

              <div className="product-actions">
                <button className="save-btn" onClick={() => save(p)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
                <button className="delete-btn" onClick={() => del(p._id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
</div>
    </>
  );
}
