import mongoose from "mongoose";

import { ReorderPlan } from "../models/reorderPlan.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { createReorderPlan } from "../services/reorder.service.js";

import { REORDER_PLAN_STATUS } from "../constants.js";

const createPlan = asyncHandler(async (req, res) => {
  const plan = await createReorderPlan({
    ownerId: req.user._id,

    note: req.body.note,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, plan, "Reorder plan created successfully"));
});

const getPlans = asyncHandler(async (req, res) => {
  const filter = {
    owner: req.user._id,
  };

  if (req.query.status) {
    if (!Object.values(REORDER_PLAN_STATUS).includes(req.query.status)) {
      throw new ApiError(400, "Invalid reorder status");
    }

    filter.status = req.query.status;
  }

  const plans = await ReorderPlan.find(filter)
    .populate("items.productId", "name sku category stock minStock")
    .populate("items.supplierId", "name company email phone status")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, plans, "Reorder plans fetched successfully"));
});

const getPlanById = asyncHandler(async (req, res) => {
  const { reorderId } = req.params;

  if (!mongoose.isValidObjectId(reorderId)) {
    throw new ApiError(400, "Invalid reorder plan ID");
  }

  const plan = await ReorderPlan.findOne({
    _id: reorderId,
    owner: req.user._id,
  })
    .populate("items.productId", "name sku category stock minStock")
    .populate("items.supplierId", "name company email phone status");

  if (!plan) {
    throw new ApiError(404, "Reorder plan not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Reorder plan fetched successfully"));
});

const updatePlan = asyncHandler(async (req, res) => {
  const { reorderId } = req.params;

  if (!mongoose.isValidObjectId(reorderId)) {
    throw new ApiError(400, "Invalid reorder plan ID");
  }

  const plan = await ReorderPlan.findOne({
    _id: reorderId,
    owner: req.user._id,
  });

  if (!plan) {
    throw new ApiError(404, "Reorder plan not found");
  }

  const { status, note } = req.body;

  if (status !== undefined) {
    if (!Object.values(REORDER_PLAN_STATUS).includes(status)) {
      throw new ApiError(400, "Invalid reorder status");
    }

    plan.status = status;
  }

  if (note !== undefined) {
    plan.note = String(note).trim();
  }

  await plan.save();

  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Reorder plan updated successfully"));
});

const deletePlan = asyncHandler(async (req, res) => {
  const { reorderId } = req.params;

  if (!mongoose.isValidObjectId(reorderId)) {
    throw new ApiError(400, "Invalid reorder plan ID");
  }

  const plan = await ReorderPlan.findOneAndDelete({
    _id: reorderId,
    owner: req.user._id,
  });

  if (!plan) {
    throw new ApiError(404, "Reorder plan not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Reorder plan deleted successfully"));
});

export { createPlan, getPlans, getPlanById, updatePlan, deletePlan };
