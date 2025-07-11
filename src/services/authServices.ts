import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/db";
import { sendMail } from "../utils/sendMail";
import { generateToken } from "../utils/jwtUtils";
import { User } from "../../generated/prisma";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  image?: string
) => {
  const isUserExists: User = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = await prisma.user.create({
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

  return user;
};

export const loginUserService = async (email: string, password: string) => {
  const user: User = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new Error("User not found.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid user creadentials");
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    },
  };
};

export const forgotPasswordService = async (email: string) => {
  const user: User = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
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
};

export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  const user: User = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpire: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
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
};

export const changePasswordService = async (
  userId: number,
  oldPassword: string,
  newPassword: string
) => {
  const user: User = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Type guard: ensures user is not null and user.password is not null
  if (!user || !user.password) {
    throw new Error("User not found or password not set");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Old password does not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });
};
