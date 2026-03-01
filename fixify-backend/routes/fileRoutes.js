const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// serve credential image/buffer
router.get("/users/:id/credentials", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findById(req.params.id).select("credentials");
    if (!user || !user.credentials || !user.credentials.data) {
      return res.status(404).json({ message: "Credentials not found" });
    }
    res.contentType(user.credentials.contentType);
    res.send(user.credentials.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users/:id/validID", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findById(req.params.id).select("validID");
    if (!user || !user.validID || !user.validID.data) {
      return res.status(404).json({ message: "Valid ID not found" });
    }
    res.contentType(user.validID.contentType);
    res.send(user.validID.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
