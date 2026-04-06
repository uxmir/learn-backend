import crypto from "crypto";
import jwt from "jsonwebtoken";
import ApiError from "./api-error";
const generateToken = async () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  return {
    rawToken,
    hashedToken,
  };
};
const generateAccessToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET || '15m', {
    JWT_ACCESS_EXPIRES_IN: "15m",
  });
  if (!token) throw ApiError.notFound("Invalid token");
  return token;
};
const generateRefreshToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '7d', {
    JWT_REFRESH_EXPIRES_IN: "7d",
  });
  if (!token) throw ApiError.notFound("Invalid token");
  return token;
};

const verifyAccessToken = async (token) => {
  const token = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  if (!token) throw ApiError.notFound("Invalid token");
  return token;
};
const verifyRefreshToken = async (token) => {
  const token = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  if (!token) throw ApiError.notFound("Invalid token");
  return token;
};

export {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
