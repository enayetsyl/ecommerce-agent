import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/errors";
import { catchAsync } from "../utils/catchAsync";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new UnauthorizedError(
        "You are not logged in. Please login to get access."
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  }
);
