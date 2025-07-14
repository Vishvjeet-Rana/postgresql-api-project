import { Request, Response, NextFunction } from "express";
import { ZodError, AnyZodObject } from "zod";

type ValidatableSchema = {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

const validate =
  (schema: ValidatableSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.params) schema.params.parse(req.params);
      if (schema.query) schema.query.parse(req.query);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      next(err);
    }
  };

export default validate;
