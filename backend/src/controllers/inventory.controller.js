import mongoose from "mongoose";

import { InventoryTransaction } from "../models/inventoryTransaction.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { adjustInventoryStock } from "../services/inventory.service.js";

import { INVENTORY_TRANSACTION_TYPES } from "../constants.js";

const adjustStock = asyncHandler(async (req, res) => {
  const { productId, quantity, type, note } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product is required");
  }

  if (quantity === undefined || quantity === null || quantity === "") {
    throw new ApiError(400, "Quantity is required");
  }

  if (!type) {
    throw new ApiError(400, "Transaction type is required");
  }

  const result = await adjustInventoryStock({
    ownerId: req.user._id,

    productId,

    quantity,

    type,

    note,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Inventory updated successfully"));
});

const getInventoryTransactions = asyncHandler(async (req, res) => {
  const { productId, type, sortOrder = "desc" } = req.query;

  const filter = {
    owner: req.user._id,
  };

  if (productId) {
    if (!mongoose.isValidObjectId(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    filter.productId = productId;
  }

  if (type) {
    const validTypes = Object.values(INVENTORY_TRANSACTION_TYPES);

    if (!validTypes.includes(type)) {
      throw new ApiError(400, "Invalid inventory transaction type");
    }

    filter.type = type;
  }

  const transactions = await InventoryTransaction.find(filter)
    .populate("productId", "name sku category")
    .sort({
      createdAt: sortOrder === "asc" ? 1 : -1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transactions,
        "Inventory transactions fetched successfully",
      ),
    );
});

const getProductInventoryHistory = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const transactions = await InventoryTransaction.find({
    owner: req.user._id,

    productId,
  })
    .populate("productId", "name sku category")
    .sort({
      createdAt: -1,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transactions,
        "Product inventory history fetched successfully",
      ),
    );
});

export { adjustStock, getInventoryTransactions, getProductInventoryHistory };
