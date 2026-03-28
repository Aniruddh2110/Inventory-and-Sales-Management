import { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { getRole } from "../utils/auth";
import "./Sales.css";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const role = getRole();

  useEffect(() => {
    API.get("/sales").then(res => setSales(res.data));
  }, []);

  const exportCSV = () => {
    let csv = "Product,Price,Quantity,Amount,Sold By\n";

    sales.forEach(s => {
      csv += `${s.product?.name || ""},${s.product?.price || 0},${s.quantity},${s.totalAmount},${s.soldBy?.name || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sales.csv";
    a.click();
  };

  return (
    <>
      <div className="admin-page">
        <AdminSidebar />

        <div className="admin-content">
          <div className="sales-container">
            <div className="sales-header">
              <h2>Sales History</h2>
            {role === "admin" && (
              <button className="export-btn" onClick={exportCSV}>
                Export CSV
              </button>
            )}
            </div>

            <div className="table">
              <div className="row head">
                <span>Product</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Amount</span>
                <span>Sold By</span>
              </div>

              {sales.map(s => (
                <div className="row" key={s._id}>
                  <span>{s.product?.name}</span>
                  <span>{s.quantity}</span>
                  <span>₹{s.product?.price}</span>
                  <span>₹{s.totalAmount}</span>
                  <span>{s.soldBy?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
