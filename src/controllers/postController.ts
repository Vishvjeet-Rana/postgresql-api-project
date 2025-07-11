import prisma from "../config/db";
import { Request, Response } from "express";
import { Post } from "../../generated/prisma";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and Content is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const post: Post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        authorId: req.user.id,
      },
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts: Post = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post: Post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) return res.status(400).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    // debugging
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ message: "Invalid post ID (must be a number)" });
    }

    const { title, content } = req.body;

    const post: Post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title !== "string" ? title : undefined,
        content: content !== "string" ? content : undefined,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res
        .status(400)
        .json({ message: "Invalid post ID (must be a number)" });
    }

    const post: Post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) return res.status(400).json({ message: "Post not found" });

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
