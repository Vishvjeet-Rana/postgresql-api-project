import prisma from "../config/db.js";
import { Request, Response, NextFunction } from "express";

export const isAuthorOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Expects a number as id" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const isAuthor = post.authorId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    next();
  } catch (error) {
    console.error("Ownership check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
