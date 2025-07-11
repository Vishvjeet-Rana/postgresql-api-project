import { Request, Response, NextFunction } from "express";

export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admins Only route" });
  }
  next();
};
