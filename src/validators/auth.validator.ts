import { z } from "zod";

// register schema
export const registerSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, "Password must have minimum 8 characters"),
});

// login schema
export const loginSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  password: z.string().min(8, "Password must have minimum 8 characters"),
});

// forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

// reset password schema
export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: z.string().min(8, "Password must have minimum 8 characters"),
  }),
});

// change password schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Old Password is required"),
  newPassword: z.string().min(8, "New Password must have minimum 8 characters"),
});
