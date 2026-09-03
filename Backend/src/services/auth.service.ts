import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { env } from "../env";
import { JWT_EXPIRES_IN } from "../constants";
import { ApiError } from "../utils/apiError";
import { RegisterInput, LoginInput } from "../interfaces";

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: input.role ?? "PHARMACIST",
  });

  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  };
}
