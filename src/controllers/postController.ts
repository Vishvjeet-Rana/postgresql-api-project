import { Request, Response } from "express";
import { PostService } from "../services/postServices";
const postService = new PostService();

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;
    const image = req.file?.filename;
    const post = await postService.createPostService(
      title,
      content,
      authorId,
      image
    );

    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPostsService();

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

    const post = await postService.getPostByIdService(postId);

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

    const updatedPost = await postService.updatedPostService(
      postId,
      title,
      content
    );

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

    const result = await postService.deletePostService(postId);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
