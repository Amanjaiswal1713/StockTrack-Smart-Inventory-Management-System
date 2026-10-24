import mongoose from "mongoose";

import { Product } from "../models/product.model.js";

import { InventoryTransaction } from "../models/inventoryTransaction.model.js";

import { ApiError } from "../utils/ApiError.js";

import { INVENTORY_TRANSACTION_TYPES } from "../constants.js";

const normalizeQuantity = (quantity) => {
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  return numericQuantity;
};

const adjustInventoryStock = async ({
  ownerId,
  productId,
  quantity,
  type,
  note = "",
}) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const allowedTypes = [
    INVENTORY_TRANSACTION_TYPES.STOCK_IN,

    INVENTORY_TRANSACTION_TYPES.STOCK_OUT,

    INVENTORY_TRANSACTION_TYPES.ADJUSTMENT,
  ];

  if (!allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid inventory transaction type");
  }

  const numericQuantity = normalizeQuantity(quantity);

  let finalProduct = null;
  let finalTransaction = null;

  await mongoose.connection.transaction(async (session) => {
    const product = await Product.findOne({
      _id: productId,
      owner: ownerId,
    }).session(session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const previousStock = Number(product.stock);

    let newStock = previousStock;

    if (type === INVENTORY_TRANSACTION_TYPES.STOCK_IN) {
      newStock = previousStock + numericQuantity;
    }

    if (type === INVENTORY_TRANSACTION_TYPES.STOCK_OUT) {
      if (numericQuantity > previousStock) {
        throw new ApiError(400, "Insufficient stock");
      }

      newStock = previousStock - numericQuantity;
    }

    if (type === INVENTORY_TRANSACTION_TYPES.ADJUSTMENT) {
      newStock = numericQuantity;
    }

    product.stock = newStock;

    await product.save({
      session,
    });

    const [transaction] = await InventoryTransaction.create(
      [
        {
          owner: ownerId,

          productId: product._id,

          type,

          quantity:
            type === INVENTORY_TRANSACTION_TYPES.ADJUSTMENT
              ? Math.abs(newStock - previousStock)
              : numericQuantity,

          previousStock,

          newStock,

          note: typeof note === "string" ? note.trim() : "",
        },
      ],
      {
        session,
      },
    );

    finalProduct = product;

    finalTransaction = transaction;
  });

  const populatedProduct = await Product.findById(finalProduct._id).populate(
    "supplierId",
    "name company email phone status",
  );

  const populatedTransaction = await InventoryTransaction.findById(
    finalTransaction._id,
  ).populate("productId", "name sku category");

  return {
    product: populatedProduct,

    transaction: populatedTransaction,
  };
};

export { adjustInventoryStock };
