const express = require("express");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// All users
router.get("/", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Staff
router.get("/staff", protect, adminOnly, async (req, res) => {
  const staff = await User.find({ role: "staff" }).select("-password");
  res.json(staff);
});

// Customers
router.get("/customers", protect, adminOnly, async (req, res) => {
  const users = await User.find({ role: "customer" }).select("-password");
  res.json(users);
});

// Stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  const customers = await User.countDocuments({ role: "customer" });
  const staff = await User.countDocuments({ role: "staff" });
  res.json({ customers, staff });
});

// Toggle staff active status (admin only)
router.put("/staff/:id/toggle-status", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.role !== "staff") {
      return res.status(400).json({ message: "Can only toggle status for staff members" });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ message: `Staff ${user.isActive ? 'enabled' : 'disabled'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;