import mongoose, { Schema } from "mongoose";

const saleSchema = new Schema(
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

    quantity: {
      type: Number,
      required: true,

      min: [1, "Sale quantity must be at least one"],
    },

    unitPrice: {
      type: Number,
      required: true,

      min: [0, "Unit price cannot be negative"],
    },

    revenue: {
      type: Number,
      required: true,

      min: [0, "Revenue cannot be negative"],
    },

    stockBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    stockAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    note: {
      type: String,
      trim: true,
      default: "",

      maxlength: [500, "Sale note cannot exceed 500 characters"],
    },

    soldAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

saleSchema.index({
  owner: 1,
  soldAt: -1,
});

saleSchema.index({
  owner: 1,
  productId: 1,
  soldAt: -1,
});

export const Sale = mongoose.model("Sale", saleSchema);
