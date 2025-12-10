import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { ValidationError } from "../utils/errors";

export const validate = (schema: ZodType<any, any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => {
          const path = issue.path.join(".");
          return `${path}: ${issue.message}`;
        });
        throw new ValidationError(errorMessages.join(", "));
      }
      throw error;
    }
  });
};
