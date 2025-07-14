import { z } from "zod";

// for creating user
export const createUserSchema = {
  body: z.object({
    name: z.string().min(5, "Name must be at least 5 characters long."),
    email: z.string().email("Invalid email format"),
    role: z.enum(["USER", "ADMIN"]).optional(),
  }),
};

export const updateUserSchema = {
  body: z.object({
    name: z.string().min(5).optional(),
    email: z.string().email("Invalid email format").optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive("Invalid user Id"),
  }),
};

// GET/DELETE user by id
export const userIdParamSchema = {
  params: z.object({
    id: z.coerce.number().int().positive("Invalid user Id"),
  }),
};
