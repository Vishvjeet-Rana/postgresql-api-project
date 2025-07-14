import { Request, Response } from "express";
import {
  createUserByAdminService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updatedUserService,
  verifyUserService,
} from "../services/adminServices";

// Admin creates a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await createUserByAdminService(name, email, req.user.name);

    res.status(200).json({
      message: "User created successfully and email sent to reset password",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get all users (optionally filtered by verification)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const verifiedQuery = req.query.verified as string;
    const users = await getAllUsersService(verifiedQuery);

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserByIdService(userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update user info
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const updatedUser = await updatedUserService(userId, req.body);
    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await deleteUserService(userId);

    return res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

//  Verify user (set `isVerified` to true)
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await verifyUserService(userId);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Verify user error:", error);
    res.status(500).json({ message: error.message });
  }
};
