import prisma from "../config/db";
import { User } from "../../generated/prisma";

export const getProfileService = async (userId: number) => {
  const user: User = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  return user;
};

export const updateProfileService = async (
  userId: number,
  name?: string,
  email?: string
) => {
  const user: User = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name !== "string" ? name : undefined,
      email: email !== "string" ? email : undefined,
    },
  });

  return updatedUser;
};

export const uploadProfilePictureService = async (
  userId: number,
  filename: string
) => {
  const filePath = `/uploads/${filename}`;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      profilePicture: filePath,
    },
  });

  return {
    user,
    filePath,
  };
};
