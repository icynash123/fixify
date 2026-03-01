const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");
const User = require("../models/User");

// Simple protected route that returns dashboard info based on role
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Example role-based payload
    if (user.role === "admin") {
      return res.json({
        dashboard: "admin",
        message: "Admin dashboard data",
        user,
      });
    }
    if (user.role === "handyman") {
      return res.json({
        dashboard: "handyman",
        message: "Handyman dashboard data",
        user,
      });
    }
    return res.json({
      dashboard: "customer",
      message: "Customer dashboard data",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// example of role-restricted sub-route
router.get("/admin-only", auth, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Secret admin data" });
});

router.get(
  "/handyman-only",
  auth,
  authorizeRoles("handyman", "admin"),
  (req, res) => {
    res.json({ message: "Handyman or admin data" });
  },
);

module.exports = router;
