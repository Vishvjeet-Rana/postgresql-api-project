// import { Request, Response } from "express";
// import { createUserByAdminService } from "../services/adminServices";

// // Admin creates a new user
// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email } = req.body;

//     const user = await createUserByAdminService(name, email, req.user.name);

//     res.status(200).json({
//       message: "User created successfully and email sent to reset password",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         isVerified: user.isVerified,
//       },
//     });
//   } catch (error: any) {
//     console.error(error);
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get all users (optionally filtered by verification)
// export const getAllUsers = async (req: Request, res: Response) => {
//   const verifiedQuery = req.query.verified as string;
//   const filter = verifiedQuery === "false" ? { isVerified: false } : {};

//   const users: User = await prisma.user.findMany({
//     where: filter,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       isVerified: true,
//       profilePicture: true,
//       createdAt: true,
//     },
//   });

//   res.status(200).json(users);
// };

// // Get single user by ID
// export const getUserById = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId))
//     return res.status(400).json({ message: "Invalid user ID" });

//   const user: User = await prisma.user.findUnique({
//     where: { id: userId },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       isVerified: true,
//       createdAt: true,
//     },
//   });

//   if (!user) return res.status(400).json({ message: "User not found" });

//   res.status(200).json(user);
// };

// // Update user info
// export const updateUser = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId))
//     return res.status(400).json({ message: "Invalid user ID" });

//   const { name, email, role } = req.body;

//   // Use Partial type to allow optional updates
//   const data: Partial<{ name: string; email: string; role: string }> = {};
//   if (name && name !== "string") data.name = name;
//   if (email && email !== "string") data.email = email;
//   if (role && role !== "string") data.role = role;

//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data,
//     });

//     res.json({
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (error: any) {
//     res.status(400).json({ message: "User not found" });
//   }
// };

// // Delete user by ID
// export const deleteUser = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId))
//     return res.status(400).json({ message: "Invalid user ID" });

//   const user: User = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) return res.status(404).json({ message: "User not found" });

//   try {
//     await prisma.user.delete({
//       where: { id: userId },
//     });

//     res.status(200).json({
//       message: "User deleted successfully",
//     });
//   } catch (error: any) {
//     res.status(404).json({ message: "User not found" });
//   }
// };

// //  Verify user (set `isVerified` to true)
// export const verifyUser = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId))
//     return res.status(400).json({ message: "Invalid user ID" });

//   const user: User = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) return res.status(404).json({ message: "User not found" });

//   try {
//     const verifiedUpdatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         isVerified: true,
//       },
//     });

//     res.json({
//       message: "User verified successfully",
//       user: verifiedUpdatedUser,
//     });
//   } catch (error: any) {
//     console.error("Verify user error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
