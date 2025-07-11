import { z } from "zod";

// for creating post
export const createPostSchema = z.object({
  title: z.string().min(15, "Title must be at least 15 characters long."),
  content: z.string().min(30, "Content must be at least 30 characters long"),
  image: z.string().optional(),
});

// for updating post
export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(15).optional(),
    content: z.string().min(30).optional(),
    image: z.string().optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive("Invalid post Id"),
  }),
});

// for getting or deleting a post
export const postIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid post Id"),
  }),
});
