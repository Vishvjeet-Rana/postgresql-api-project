import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  role: string;
}

export const generateToken = (id: number, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined in .env");

  const payload: TokenPayload = { id, role };
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};
