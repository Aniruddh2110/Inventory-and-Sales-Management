const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const { protect, adminOnly, adminOrStaff } = require("../middleware/authMiddleware");

const router = express.Router();

// Place order (Customer)
router.post("/", protect, async (req, res) => {
  const { items } = req.body;
  let total = 0;

  for (let i of items) {
    const product = await Product.findById(i.product);
    total += product.price * i.quantity;
  }

  const order = await Order.create({
    items,
    total,
    orderedBy: req.user.id
  });

  res.status(201).json(order);
});

// View orders (Staff/Admin ONLY)
router.get("/", protect, adminOrStaff, async (req, res) => {
  const orders = await Order.find()
    .populate("items.product", "name price image")
    .populate({
      path: "orderedBy",
      select: "name email",
      options: { strictPopulate: false }
    })
    .sort({ createdAt: -1 });

  res.json(orders);
});

// Customer order history
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ orderedBy: req.user.id })
    .populate("items.product", "name price image")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// Update order status
router.put("/:id/status", protect, adminOrStaff, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id)
    .populate("items.product");

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (status === "in progress" && order.status === "pending") {
    for (let i of order.items) {
      i.product.quantity -= i.quantity;
      await i.product.save();

      await Sale.create({
        product: i.product._id,
        quantity: i.quantity,
        totalAmount: i.product.price * i.quantity,
        soldBy: req.user._id
      });
    }
  }

  order.status = status;
  await order.save();

  res.json(order);
});

// Admin stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pending = await Order.countDocuments({ status: "pending" });

  res.json({ totalOrders, pending });
});

module.exports = router;
