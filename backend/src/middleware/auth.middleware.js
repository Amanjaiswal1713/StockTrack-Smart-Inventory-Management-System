import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const cookieToken = req.cookies?.accessToken;

  const authHeader = req.header("Authorization");

  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,

      process.env.ACCESS_TOKEN_SECRET,
    );
  } catch {
    throw new ApiError(401, "Access token is invalid or expired");
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "User linked to this token no longer exists");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }

  req.user = user;

  next();
});

export { verifyJWT };
