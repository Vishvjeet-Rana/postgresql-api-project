import { Request, Response, NextFunction } from "express";

// export const responseFormatter = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const oldJson = res.json;

//   res.json = function (data: any) {
//     return oldJson.call(this, {
//       status: "success",
//       data,
//     });
//   };
//   next();
// };

export const responseFormatter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const oldJson = res.json;

  res.json = function (data: any) {
    // Don't wrap if it's already an error
    if (res.statusCode >= 400) {
      return oldJson.call(this, data);
    }

    return oldJson.call(this, {
      status: "success",
      data,
    });
  };

  next();
};
