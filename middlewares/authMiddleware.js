import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profilePicture: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    return res.status(401).json({ message: "No Token Provided" });
  }
};
