import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Supplier } from "../models/supplier.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { InventoryTransaction } from "../models/inventoryTransaction.model.js";
import { INVENTORY_TRANSACTION_TYPES } from "../constants.js";

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const parseNonNegativeNumber = (value, fieldName) => {
  if (value === "" || value === null || value === undefined) {
    throw new ApiError(400, `${fieldName} is required`);
  }
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new ApiError(400, `${fieldName} must be a non-negative number`);
  }
  return numberValue;
};
const verifyOwnedSupplier = async (supplierId, ownerId) => {
  if (supplierId === null || supplierId === undefined || supplierId === "") {
    return null;
  }
  if (!mongoose.isValidObjectId(supplierId)) {
    throw new ApiError(400, "Invalid supplier ID");
  }
  const supplier = await Supplier.findOne({
    _id: supplierId,
    owner: ownerId,
  });
  if (!supplier) {
    throw new ApiError(404, "Supplier not found in your account");
  }
  return supplier._id;
};
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, supplierId, price, stock, minStock } = req.body;
  if (typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "Product name is required");
  }
  if (typeof sku !== "string" || !sku.trim()) {
    throw new ApiError(400, "SKU is required");
  }
  if (typeof category !== "string" || !category.trim()) {
    throw new ApiError(400, "Category is required");
  }
  const normalizedSku = sku.trim().toUpperCase();
  const existingProduct = await Product.findOne({
    owner: req.user._id,
    sku: normalizedSku,
  });
  if (existingProduct) {
    throw new ApiError(409, "A product with this SKU already exists");
  }
  const verifiedSupplierId = await verifyOwnedSupplier(
    supplierId,
    req.user._id,
  );
  const numericPrice = parseNonNegativeNumber(price, "Price");
  const numericStock = parseNonNegativeNumber(stock, "Current stock");
  const numericMinStock = parseNonNegativeNumber(minStock, "Minimum stock");
  let productId = null;
  await mongoose.connection.transaction(async (session) => {
    const [product] = await Product.create(
      [
        {
          name: name.trim(),
          sku: normalizedSku,
          category: category.trim(),
          supplierId: verifiedSupplierId,
          price: numericPrice,
          stock: numericStock,
          minStock: numericMinStock,
          owner: req.user._id,
        },
      ],
      {
        session,
      },
    );
    productId = product._id;
    if (numericStock > 0) {
      await InventoryTransaction.create(
        [
          {
            owner: req.user._id,
            productId: product._id,
            type: INVENTORY_TRANSACTION_TYPES.ADJUSTMENT,
            quantity: numericStock,
            previousStock: 0,
            newStock: numericStock,
            note: "Initial product stock",
          },
        ],
        {
          session,
        },
      );
    }
  });
  const populatedProduct = await Product.findById(productId).populate(
    "supplierId",
    "name company email phone status",
  );
  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedProduct, "Product created successfully"),
    );
});
const getProducts = asyncHandler(async (req, res) => {
  const {
    search = "",
    category = "",
    stockStatus = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;
  const filter = {
    owner: req.user._id,
  };
  if (typeof category === "string" && category.trim()) {
    filter.category = category.trim();
  }
  if (typeof search === "string" && search.trim()) {
    const searchExpression = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [
      {
        name: searchExpression,
      },
      {
        sku: searchExpression,
      },
      {
        category: searchExpression,
      },
    ];
  }
  if (stockStatus === "out-of-stock") {
    filter.stock = 0;
  }
  if (stockStatus === "in-stock") {
    filter.$expr = {
      $gt: ["$stock", "$minStock"],
    };
  }
  if (stockStatus === "low-stock") {
    filter.stock = {
      $gt: 0,
    };
    filter.$expr = {
      $lte: ["$stock", "$minStock"],
    };
  }
  const allowedSortFields = [
    "name",
    "sku",
    "category",
    "price",
    "stock",
    "minStock",
    "createdAt",
    "updatedAt",
  ];
  const selectedSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const products = await Product.find(filter)
    .populate("supplierId", "name company email phone status")
    .sort({
      [selectedSortField]: sortDirection,
    });
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }
  const product = await Product.findOne({
    _id: productId,
    owner: req.user._id,
  }).populate("supplierId", "name company email phone address status");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }
  const product = await Product.findOne({
    _id: productId,
    owner: req.user._id,
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  const { name, sku, category, supplierId, price, minStock } = req.body;
  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new ApiError(400, "Product name cannot be empty");
    }
    product.name = name.trim();
  }
  if (sku !== undefined) {
    if (typeof sku !== "string" || !sku.trim()) {
      throw new ApiError(400, "SKU cannot be empty");
    }
    const normalizedSku = sku.trim().toUpperCase();
    const duplicateProduct = await Product.findOne({
      owner: req.user._id,
      sku: normalizedSku,
      _id: {
        $ne: product._id,
      },
    });
    if (duplicateProduct) {
      throw new ApiError(409, "A product with this SKU already exists");
    }
    product.sku = normalizedSku;
  }
  if (category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      throw new ApiError(400, "Category cannot be empty");
    }
    product.category = category.trim();
  }
  if (supplierId !== undefined) {
    product.supplierId = await verifyOwnedSupplier(supplierId, req.user._id);
  }
  if (price !== undefined) {
    product.price = parseNonNegativeNumber(price, "Price");
  }
  if (minStock !== undefined) {
    product.minStock = parseNonNegativeNumber(minStock, "Minimum stock");
  }
  await product.save();
  const populatedProduct = await Product.findById(product._id).populate(
    "supplierId",
    "name company email phone status",
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, populatedProduct, "Product updated successfully"),
    );
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }
  const product = await Product.findOneAndDelete({
    _id: productId,
    owner: req.user._id,
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product deleted successfully"));
});
export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
