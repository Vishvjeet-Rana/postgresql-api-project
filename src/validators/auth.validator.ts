import { z } from "zod";

// Register Schema
export const registerSchema = {
  body: z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, "Password must have minimum 8 characters"),
  }),
};

// Login Schema
export const loginSchema = {
  body: z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, "Password must have minimum 8 characters"),
  }),
};

// Forgot Password Schema
export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email({ message: "Invalid email" }),
  }),
};

// Reset Password Schema
export const resetPasswordSchema = {
  params: z.object({
    token: z.string(),
  }),
  body: z.object({
    newPassword: z.string().min(8, "Password must have minimum 8 characters"),
  }),
};

// Change Password Schema
export const changePasswordSchema = {
  body: z.object({
    oldPassword: z.string().min(8, "Old Password is required"),
    newPassword: z
      .string()
      .min(8, "New Password must have minimum 8 characters"),
  }),
};
