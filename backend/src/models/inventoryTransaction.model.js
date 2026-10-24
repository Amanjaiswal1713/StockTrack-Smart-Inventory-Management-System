import mongoose, { Schema } from "mongoose";

import { INVENTORY_TRANSACTION_TYPES } from "../constants.js";

const inventoryTransactionSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,

      ref: "Product",

      required: true,

      index: true,
    },

    type: {
      type: String,

      enum: Object.values(INVENTORY_TRANSACTION_TYPES),

      required: true,

      index: true,
    },

    quantity: {
      type: Number,

      required: true,

      min: [0, "Transaction quantity cannot be negative"],
    },

    previousStock: {
      type: Number,

      required: true,

      min: 0,
    },

    newStock: {
      type: Number,

      required: true,

      min: 0,
    },

    note: {
      type: String,

      trim: true,

      maxlength: [500, "Transaction note cannot exceed 500 characters"],

      default: "",
    },

    saleId: {
      type: Schema.Types.ObjectId,

      ref: "Sale",
      default: null,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

inventoryTransactionSchema.index({
  owner: 1,
  createdAt: -1,
});

inventoryTransactionSchema.index({
  owner: 1,
  productId: 1,
  createdAt: -1,
});

inventoryTransactionSchema.index({
  owner: 1,
  type: 1,
  createdAt: -1,
});

export const InventoryTransaction = mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema,
);
