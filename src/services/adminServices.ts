import prisma from "../config/db"; // Removed .js extension
import { sendMail } from "../utils/sendMail"; // Removed .js extension
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { User } from "../generated/prisma";
import { Role } from "../generated/prisma";

export const createUserByAdminService = async (
  name: string,
  email: string,
  adminName: string
): Promise<User> => {
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    throw new Error("User already exists");
  }

  const resetToken = uuidv4();
  const expireTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  const user: User = await prisma.user.create({
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
      <p>You've been added by Admin <b>${adminName}</b>.</p>
      <p>Click the link below to set your password:</p>
      <a href="${link}">${link}</a>
    `,
  });

  return user;
};

type PublicUser = Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "role"
  | "isVerified"
  | "profilePicture"
  | "createdAt"
>;

export const getAllUsersService = async (
  verifiedQuery?: string
): Promise<PublicUser[]> => {
  const filter = verifiedQuery === "false" ? { isVerified: false } : {};

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

  return users;
};

type IdUser = Pick<
  User,
  "id" | "name" | "email" | "role" | "isVerified" | "createdAt"
>;

export const getUserByIdService = async (userId: number): Promise<IdUser> => {
  if (isNaN(userId)) throw new Error("Invalid user Id");

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

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: Role;
}

export const updatedUserService = async (
  userId: number,
  data: UpdateUserInput
): Promise<User> => {
  if (isNaN(userId)) throw new Error("Invalid user Id");

  // Filter out unwanted placeholder values like "string"
  const updateData: UpdateUserInput = {};
  if (data.name && data.name !== "string") updateData.name = data.name;
  if (data.email && data.email !== "string") updateData.email = data.email;
  if (data.role && ["USER", "ADMIN"].includes(data.role))
    updateData.role = data.role as Role;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updatedUser;
  } catch (error) {
    throw new Error("User not found");
  }
};

export const deleteUserService = async (
  userId: number
): Promise<{ message: string }> => {
  if (isNaN(userId)) {
    throw new Error("Invalid user Id");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully" };
};

export const verifyUserService = async (
  userId: number
): Promise<{ message: string; user: User }> => {
  if (isNaN(userId)) throw new Error("Invalid user Id");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const verifiedUpdatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
    },
  });

  return {
    message: "User verified successfully",
    user: verifiedUpdatedUser,
  };
};
