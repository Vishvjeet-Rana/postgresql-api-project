import prisma from "../config/db"; // Removed .js extension
import { sendMail } from "../utils/sendMail"; // Removed .js extension
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { User } from "../../generated/prisma";

export const createUserByAdminService = async (
  name: string,
  email: string,
  adminName: string
) => {
  const isUserExists: User = await prisma.user.findUnique({
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
