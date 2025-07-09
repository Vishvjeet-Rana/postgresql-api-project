import prisma from "../config/db.js";
import { sendMail } from "../utils/sendMail.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const isUserExists = await prisma.user.findUnique({ where: { email } });
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const resetToken = uuidv4();
    const expireTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "USER",
        isVerified: false,
        resetToken,
        resetTokenExpire: expireTime,
      },
    });

    const link = `http://localhost:3000/api/auth/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Set Password for Blog API Project",
      html: `
      <h2>Welcome to the Blog API!</h2>
      <p>You've been added by Admin <b>${req.user.name}</b>.</p>
      <p>Click the link below to set your password:</p>
      <a href="${link}">${link}</a>
    `,
    });

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
  } catch (error) {
    console.error(error);
  }
};

export const getAllUsers = async (req, res) => {
  const filter = req.query.verified === "false" ? { isVerified: false } : {};
  const users = await prisma.user.findMany({
    where: filter,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  res.status(200).json(users);
};

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) return res.status(400).json({ message: "User not found" });

  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  const { name, email, role } = req.body;

  const data = {};
  if (name && name !== "string") data.name = name;
  if (email && email !== "string") data.email = email;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: "User not found" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      message: "User deleted sucessfully",
    });
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

export const verifyUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    const verifiedUpdatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
      },
    });

    res.json({
      message: "User verified successfully",
      user: verifiedUpdatedUser,
    });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
