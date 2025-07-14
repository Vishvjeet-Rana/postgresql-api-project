import { Request, Response } from "express";
import {
  changePasswordService,
  forgotPasswordService,
  loginUserService,
  registerUser,
  resetPasswordService,
} from "../services/authServices";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const image = req.file?.filename;

  try {
    const user = await registerUser(name, email, password, image);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await loginUserService(email, password);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await forgotPasswordService(email);
    res.status(200).json({ message: "Reset link sent to user via email" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    await resetPasswordService(token, newPassword);
    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  try {
    await changePasswordService(req.user.id, oldPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
