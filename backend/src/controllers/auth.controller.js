import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookieOptions.js";

const formatUserResponse = (user) => {
  return {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    preferences: user.preferences || {
      darkMode: false,
      notifications: true,
      lowStockAlerts: true,
      salesAlerts: true,
      compactTables: false,
    },
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
const generateTokens = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({
    validateBeforeSave: false,
  });
  return {
    accessToken,
    refreshToken,
  };
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (
    [fullName, username, email, password].some(
      (field) => typeof field !== "string" || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must contain at least 8 characters");
  }
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    $or: [
      {
        username: normalizedUsername,
      },
      {
        email: normalizedEmail,
      },
    ],
  });
  if (existingUser) {
    throw new ApiError(409, "Email or username already exists");
  }
  const user = await User.create({
    fullName: fullName.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    password,
  });
  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError(500, "Unable to create user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        formatUserResponse(createdUser),
        "Registration successful",
      ),
    );
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password +refreshToken");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }
  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Invalid email or password");
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);
  user.lastLoginAt = new Date();
  await user.save({
    validateBeforeSave: false,
  });
  const loggedInUser = await User.findById(user._id);
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: formatUserResponse(loggedInUser),
        },
        "Login successful",
      ),
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: null,
    },
  });
  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse(200, null, "Logout successful"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formatUserResponse(req.user),
        "Current user fetched successfully",
      ),
    );
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  if (!incomingToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Refresh token is invalid or expired");
  }
  const user = await User.findById(decodedToken._id).select("+refreshToken");
  if (!user || !user.isActive) {
    throw new ApiError(401, "User is unavailable");
  }
  if (user.refreshToken !== incomingToken) {
    throw new ApiError(401, "Refresh token is invalid");
  }
  const { accessToken, refreshToken } = await generateTokens(user._id);
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, null, "Authentication refreshed"));
});
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All password fields are required");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New passwords do not match");
  }
  if (newPassword.length < 8) {
    throw new ApiError(400, "Password must contain at least 8 characters");
  }
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const validPassword = await user.isPasswordCorrect(currentPassword);
  if (!validPassword) {
    throw new ApiError(400, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
};
