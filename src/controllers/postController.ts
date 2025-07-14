import { Request, Response } from "express";
import { PostService } from "../services/postServices";

export class PostController {
  constructor(private postService: PostService) {}

  public createPost = async (req: Request, res: Response) => {
    try {
      const { title, content } = req.body;
      const authorId = req.user.id;
      const image = req.file?.filename;
      const post = await this.postService.createPostService(
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

  // get all posts
  public getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.postService.getAllPostsService();

      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // get post by id
  public getPostById = async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);

      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid Post Id" });
      }

      const post = await this.postService.getPostByIdService(postId);

      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updatePost = async (req: Request, res: Response) => {
    try {
      // debugging
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res
          .status(400)
          .json({ message: "Invalid post ID (must be a number)" });
      }

      const { title, content } = req.body;

      const updatedPost = await this.postService.updatedPostService(
        postId,
        title,
        content
      );

      res.json(updatedPost);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res
          .status(400)
          .json({ message: "Invalid post ID (must be a number)" });
      }

      const result = await this.postService.deletePostService(postId);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
