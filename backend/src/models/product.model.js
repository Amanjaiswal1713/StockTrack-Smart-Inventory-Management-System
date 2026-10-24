import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,

      required: [true, "Product name is required"],

      trim: true,

      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    sku: {
      type: String,

      required: [true, "SKU is required"],

      trim: true,
      uppercase: true,

      maxlength: [50, "SKU cannot exceed 50 characters"],
    },

    category: {
      type: String,

      required: [true, "Category is required"],

      trim: true,

      maxlength: [100, "Category cannot exceed 100 characters"],
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
      index: true,
    },

    price: {
      type: Number,

      required: [true, "Price is required"],

      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,

      required: [true, "Current stock is required"],

      min: [0, "Stock cannot be negative"],

      default: 0,
    },

    minStock: {
      type: Number,

      required: [true, "Minimum stock level is required"],

      min: [0, "Minimum stock cannot be negative"],

      default: 0,
    },

    lastSaleDate: {
      type: Date,
      default: null,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * A SKU must be unique within one user's account.
 *
 * User A can use SKU PRD-001.
 * User B can also use SKU PRD-001.
 * User A cannot use PRD-001 twice.
 */
productSchema.index(
  {
    owner: 1,
    sku: 1,
  },
  {
    unique: true,
    name: "unique_product_sku_per_owner",
  },
);

productSchema.index({
  owner: 1,
  category: 1,
});

productSchema.index({
  owner: 1,
  createdAt: -1,
});

productSchema.index({
  owner: 1,
  stock: 1,
  minStock: 1,
});

export const Product = mongoose.model("Product", productSchema);
