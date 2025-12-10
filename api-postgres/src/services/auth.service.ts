import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { generateToken } from "../utils/jwt";
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../utils/errors";
import { RegisterInput, LoginInput } from "../validations/auth.validation";

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
  };
  token: string;
}

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const { email, password, name } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  // Hash password
  const saltRounds = 12;
  const password_hash = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password_hash,
      name: name || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      created_at: true,
    },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    },
    token,
  };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    },
    token,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};
