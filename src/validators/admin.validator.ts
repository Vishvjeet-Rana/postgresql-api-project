import { z } from "zod";

// for creating user
export const createUserSchema = z.object({
  name: z.string().min(5, "Name must be atleast 5 character long."),
  email: z.string().email("Invalid email format"),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(5).optional(),
    email: z.string().email("Invalid email format").optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive("Invalid user Id"),
  }),
});

// GET/DELETE user by id
export const userIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid user Id"),
  }),
});
