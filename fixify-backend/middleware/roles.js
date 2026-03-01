// middleware to enforce role-based access
module.exports = function authorizeRoles(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for your role" });
    }
    next();
  };
};
