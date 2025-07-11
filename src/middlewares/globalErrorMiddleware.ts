import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const globalErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught by middleware: ", err);

  // Handle zod validation erros
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // handle prisma static type safety errors
  if (err instanceof PrismaClientKnownRequestError) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      code: err.code,
    });
  }

  // jwt errors
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or Expired token",
    });
  }

  // other errors
  return res.status(500).json({
    status: "error",
    message: "Something went wrong !",
  });
};
