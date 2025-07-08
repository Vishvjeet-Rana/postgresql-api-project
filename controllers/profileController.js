import prisma from "../config/db.js";

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  res.status(200).json(user);
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(400).json({ message: "User not found" });

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name: name !== "string" ? name : undefined,
      email: email !== "string" ? email : undefined,
    },
  });

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
};

export const uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Profile picture not uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      profilePicture: filePath,
    },
  });

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    profilePicture: filePath,
  });
};
