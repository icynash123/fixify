const express = require("express");
const router = express.Router();
const multer = require("multer");
const { register, login } = require("../controllers/authController");
const { body, validationResult } = require("express-validator");

// use memory storage to keep file contents in RAM so we can store them in the database
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Validation error checker
function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
}

// For technician (handyman) uploads we accept 'credentials' and 'validID' files.
router.post(
  "/register",
  upload.fields([
    { name: "credentials", maxCount: 1 },
    { name: "validID", maxCount: 1 },
  ]),
  // validators
  body("role").exists().isIn(["customer", "handyman", "admin"]),
  body("email").exists().isEmail().withMessage("Valid email is required"),
  body("password")
    .exists()
    .isLength({ min: 6 })
    .withMessage("Password min length is 6"),
  body("firstName")
    .if((value, { req }) => req.body.role !== "admin")
    .notEmpty()
    .withMessage("First name is required"),
  body("lastName")
    .if((value, { req }) => req.body.role !== "admin")
    .notEmpty()
    .withMessage("Last name is required"),
  body("phone")
    .if((value, { req }) => req.body.role !== "admin")
    .notEmpty()
    .withMessage("Phone is required"),
  checkValidation,
  register,
);

router.post(
  "/login",
  body("email").exists().isEmail().withMessage("Valid email is required"),
  body("password").exists().notEmpty().withMessage("Password is required"),
  checkValidation,
  login,
);

module.exports = router;
