import { Request, Response } from "express";
import { register, login, getCurrentUser } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await register(req.body);
  sendSuccess(res, result, "User registered successfully", 201);
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await login(req.body);
  sendSuccess(res, result, "Login successful");
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const user = await getCurrentUser(userId);
  sendSuccess(res, user, "User retrieved successfully");
});
