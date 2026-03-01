const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [
        function () {
          return this.role !== "admin";
        },
        "First name is required",
      ],
      trim: true,
      minLength: [1, "First name must be at least 1 character"],
      maxLength: [50, "First name must be less than 50 characters"],
    },
    middleName: {
      type: String,
      trim: true,
      maxLength: [50, "Middle name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      required: [
        function () {
          return this.role !== "admin";
        },
        "Last name is required",
      ],
      trim: true,
      minLength: [1, "Last name must be at least 1 character"],
      maxLength: [50, "Last name must be less than 50 characters"],
    },
    phone: {
      type: String,
      required: [
        function () {
          return this.role !== "admin";
        },
        "Phone is required",
      ],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
    },
    credentials: {
      data: Buffer,
      contentType: String,
    },
    validID: {
      data: Buffer,
      contentType: String,
    },

    role: {
      type: String,
      enum: ["customer", "handyman", "admin"],
      default: "customer",
    },
    verifiedBadge: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
