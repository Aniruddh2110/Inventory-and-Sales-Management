const express = require("express");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const { protect, adminOnly, adminOrStaff } = require("../middleware/authMiddleware");

const router = express.Router();

// Create sale (Staff/Admin ONLY)
router.post("/", protect, adminOrStaff, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.quantity -= quantity;
    await product.save();

    const totalAmount = product.price * quantity;

    const sale = await Sale.create({
      product: productId,
      quantity,
      totalAmount,
      soldBy: req.user._id,
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View sales (Staff/Admin ONLY)
router.get("/", protect, adminOrStaff, async (req, res) => {
  const sales = await Sale.find()
    .populate("product", "name price")
    .populate({
      path: "soldBy",
      select: "name email",
      options: { strictPopulate: false }
    })
    .sort({ createdAt: -1 });

  res.json(sales);
});

// Admin revenue stats ONLY
router.get("/stats", protect, adminOnly, async (req, res) => {
  const sales = await Sale.find();
  const revenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  res.json({ revenue });
});

module.exports = router;
