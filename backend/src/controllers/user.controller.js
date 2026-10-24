import { User } from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const formatUserResponse = (user) => ({
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
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, username, email } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (fullName !== undefined) {
    if (typeof fullName !== "string" || fullName.trim().length < 2) {
      throw new ApiError(400, "Full name must contain at least 2 characters");
    }

    user.fullName = fullName.trim();
  }

  if (username !== undefined) {
    const normalizedUsername = String(username).trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      throw new ApiError(
        400,
        "Username can contain only letters, numbers and underscores",
      );
    }

    if (normalizedUsername.length < 3) {
      throw new ApiError(400, "Username must contain at least 3 characters");
    }

    const existingUser = await User.findOne({
      username: normalizedUsername,

      _id: {
        $ne: user._id,
      },
    });

    if (existingUser) {
      throw new ApiError(409, "Username is already in use");
    }
    user.username = normalizedUsername;
  }
  if (email !== undefined) {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new ApiError(400, "Please enter a valid email address");
    }
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: {
        $ne: user._id,
      },
    });
    if (existingUser) {
      throw new ApiError(409, "Email is already in use");
    }
    user.email = normalizedEmail;
  }
  await user.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formatUserResponse(user),
        "Profile updated successfully",
      ),
    );
});
const updatePreferences = asyncHandler(async (req, res) => {
  const allowedPreferences = [
    "darkMode",
    "notifications",
    "lowStockAlerts",
    "salesAlerts",
    "compactTables",
  ];
  const updates = {};
  for (const key of allowedPreferences) {
    if (req.body[key] !== undefined) {
      if (typeof req.body[key] !== "boolean") {
        throw new ApiError(400, `${key} must be a boolean`);
      }
      updates[`preferences.${key}`] = req.body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid preferences provided");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formatUserResponse(user),
        "Preferences updated successfully",
      ),
    );
});
export { updateProfile, updatePreferences };
