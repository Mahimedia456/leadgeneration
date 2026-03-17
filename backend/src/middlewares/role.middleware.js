export function requireAdmin(req, res, next) {
  if (!req.user || req.user.globalRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}