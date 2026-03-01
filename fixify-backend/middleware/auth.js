const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader =
    req.headers.authorization || req.headers.Authorization || req.headers.token;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
