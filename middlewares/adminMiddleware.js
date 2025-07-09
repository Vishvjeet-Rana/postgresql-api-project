export const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admins Only route" });
  }
  next();
};
