import { Request, Response, NextFunction } from "express";

export const responseFormatter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const oldJson = res.json;

  res.json = function (data: any) {
    return oldJson.call(this, {
      status: "success",
      data,
    });
  };
  next();
};
