import { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth.middleware";
import { User } from "../models/User";

function signToken(userId: string) {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as any,
  });
}

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req: AuthRequest, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password });
  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res
    .status(201)
    .json({ id: user._id.toString(), name: user.name, email: user.email });
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user._id.toString());
  setAuthCookie(res, token);

  res.json({ id: user._id.toString(), name: user.name, email: user.email });
}

export function logout(_req: AuthRequest, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}

export async function me(req: AuthRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ id: user._id.toString(), name: user.name, email: user.email });
}
