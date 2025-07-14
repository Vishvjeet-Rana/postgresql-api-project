import prisma from "../config/db";
import { User } from "../generated/prisma";

type TypeGetProfile = Pick<
  User,
  "id" | "name" | "email" | "role" | "profilePicture" | "createdAt"
>;

export class ProfileService {
  async getProfileService(userId: number): Promise<TypeGetProfile | null> {
    const user = await prisma.user.findUnique({
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
  }

  async updateProfileService(
    userId: number,
    name?: string,
    email?: string
  ): Promise<User> {
    const user = await prisma.user.findUnique({
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
  }

  async uploadProfilePictureService(
    userId: number,
    filename: string
  ): Promise<{ user: User; filePath: string }> {
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
  }
}
