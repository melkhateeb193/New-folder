import jwt from "jsonwebtoken";
import { AppError } from "../errorHandling/index.js";

export const verifyToken = async ({ token, signature, options = {} }) => {
  try {
    return jwt.verify(token, signature, options);
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
};
