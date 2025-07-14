import { Post } from "../generated/prisma";
import prisma from "../config/db.js";

export class PostService {
  async createPostService(
    title: string,
    content: string,
    authorId: number,
    image?: string
  ): Promise<Post> {
    if (!title || !content) {
      throw new Error("Title and Content is required");
    }

    const post: Post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        image,
      },
    });

    return post;
  }

  // about return type --> each item is a full Post object, and also has an author object with name and email.
  async getAllPostsService(): Promise<
    (Post & { author: { name: string; email: string } })[]
  > {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return posts;
  }

  async getPostByIdService(
    postId: number
  ): Promise<Post & { author: { name: string; email: string } }> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) throw new Error("Post not found");

    return post;
  }

  async updatedPostService(
    postId: number,
    title?: string,
    content?: string
  ): Promise<Post> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title !== "string" ? title : undefined,
        content: content !== "string" ? content : undefined,
      },
    });

    return updatedPost;
  }

  async deletePostService(postId: number): Promise<{ message: string }> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new Error("Post not found");

    await prisma.post.delete({
      where: { id: postId },
    });

    return { message: "Post deleted successfully" };
  }
}
