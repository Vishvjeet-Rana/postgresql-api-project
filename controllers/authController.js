import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/db.js";
import { sendMail } from "../utils/sendMail.js";
import { generateToken } from "../utils/jwtUtils.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const image = req.file ? req.file.name : null;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
      profilePicture: image,
    },
  });

  await sendMail({
    to: user.email,
    subject: "👋 Welcome to BlogAPI!",
    html: `<h2>Hi ${user.name},</h2><p>Thanks for joining BlogAPI!</p>`,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: image,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "Logged in successfully",
    token: generateToken(user.id, user.role),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    },
  });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const resetToken = uuidv4();
  const expireTime = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpire: expireTime,
    },
  });

  const resetUrl = `http://localhost:3000/api/auth/reset-password/${resetToken}`;

  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h3>Hello ${user.name},</h3>
      <p>You requested to reset your password. Click below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link is valid for 10 minutes.</p>
    `,
  });

  res.status(200).json({ message: "Reset link sent to user via email" });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpire: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpire: null,
    },
  });

  res.status(200).json({
    message: "Password reset successfully",
  });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password does not match" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  res.status(200).json({ message: "Password changed successfully" });
};
