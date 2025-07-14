import { Post } from "../generated/prisma";
import prisma from "../config/db.js";

export const createPostService = async (
  title: string,
  content: string,
  authorId: number,
  image?: string
) => {
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
};

export const getAllPostsService = async () => {
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
};

export const getPostByIdService = async (postId: number) => {
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
};

export const updatedPostService = async (
  postId: number,
  title?: string,
  content?: string
) => {
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
};

export const deletePostService = async (postId: number) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error("Post not found");

  await prisma.post.delete({
    where: { id: postId },
  });

  return { message: "Post deleted successfully" };
};
