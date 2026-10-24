import mongoose, { Schema } from "mongoose";

import { REORDER_PLAN_STATUS } from "../constants.js";

const reorderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,

      ref: "Product",

      required: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,

      ref: "Supplier",

      default: null,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    supplierCompany: {
      type: String,
      default: "",
      trim: true,
    },

    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumStock: {
      type: Number,
      required: true,
      min: 0,
    },

    requiredQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  },
);

const reorderPlanSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,
      index: true,
    },

    status: {
      type: String,

      enum: Object.values(REORDER_PLAN_STATUS),

      default: REORDER_PLAN_STATUS.DRAFT,

      index: true,
    },

    items: {
      type: [reorderItemSchema],

      default: [],
    },

    totalUnits: {
      type: Number,
      default: 0,
      min: 0,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

reorderPlanSchema.index({
  owner: 1,
  createdAt: -1,
});

reorderPlanSchema.index({
  owner: 1,
  status: 1,
});

export const ReorderPlan = mongoose.model("ReorderPlan", reorderPlanSchema);
