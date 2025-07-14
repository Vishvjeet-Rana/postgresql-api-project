import { Request, Response } from "express";
import {
  createPostService,
  deletePostService,
  getAllPostsService,
  getPostByIdService,
  updatedPostService,
} from "../services/postServices";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;
    const image = req.file?.filename;
    const post = await createPostService(title, content, authorId, image);

    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPostsService();

    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid Post Id" });
    }

    const post = await getPostByIdService(postId);

    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

    const updatedPost = await updatedPostService(postId, title, content);

    res.json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

    const result = await deletePostService(postId);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
