const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { role } = req.body;

  try {
    // Admin: only email + password
    if (role === "admin") {
      let { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

      email = String(email).trim().toLowerCase();

      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, password: hashedPassword, role });
      return res.status(201).json({ message: "Admin registered" });
    }

    // Customer or Handyman: require names, phone, email, password
    if (role === "customer" || role === "handyman") {
      let { firstName, middleName, lastName, phone, email, password } =
        req.body;
      if (!firstName || !lastName || !phone || !email || !password)
        return res.status(400).json({ message: "Missing required fields" });

      email = String(email).trim().toLowerCase();

      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        firstName,
        middleName,
        lastName,
        phone,
        email,
        password: hashedPassword,
        role,
      };

      if (role === "handyman") {
        // require uploaded credentials and validID
        const credentialsFile =
          req.files && req.files.credentials && req.files.credentials[0];
        const validIDFile =
          req.files && req.files.validID && req.files.validID[0];
        if (!credentialsFile || !validIDFile)
          return res
            .status(400)
            .json({ message: "Handyman must upload credentials and valid ID" });

        // store file buffers in database
        userData.credentials = {
          data: credentialsFile.buffer,
          contentType: credentialsFile.mimetype,
        };
        userData.validID = {
          data: validIDFile.buffer,
          contentType: validIDFile.mimetype,
        };
      }

      await User.create(userData);
      return res.status(201).json({ message: "User registered" });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = String(email || "")
      .trim()
      .toLowerCase();
    console.log("Login attempt for email:", email);
    const user = await User.findOne({ email });
    console.log("User lookup result:", !!user);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
