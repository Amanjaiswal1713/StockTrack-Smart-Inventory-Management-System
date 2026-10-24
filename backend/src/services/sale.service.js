import mongoose from "mongoose";

import { Product } from "../models/product.model.js";

import { Sale } from "../models/sale.model.js";

import { InventoryTransaction } from "../models/inventoryTransaction.model.js";

import { ApiError } from "../utils/ApiError.js";

import { INVENTORY_TRANSACTION_TYPES } from "../constants.js";

const parseSaleQuantity = (quantity) => {
  const numericQuantity = Number(quantity);

  if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
    throw new ApiError(400, "Sale quantity must be a positive whole number");
  }

  return numericQuantity;
};

const recordProductSale = async ({
  ownerId,
  productId,
  quantity,
  note = "",
}) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const numericQuantity = parseSaleQuantity(quantity);

  let createdSaleId = null;
  let updatedProductId = null;
  let transactionId = null;

  await mongoose.connection.transaction(async (session) => {
    const product = await Product.findOne({
      _id: productId,
      owner: ownerId,
    }).session(session);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const stockBefore = Number(product.stock);

    if (numericQuantity > stockBefore) {
      throw new ApiError(400, "Insufficient stock");
    }

    const soldAt = new Date();

    const unitPrice = Number(product.price);

    const revenue = unitPrice * numericQuantity;

    const stockAfter = stockBefore - numericQuantity;

    const [sale] = await Sale.create(
      [
        {
          owner: ownerId,

          productId: product._id,

          quantity: numericQuantity,

          unitPrice,

          revenue,

          stockBefore,

          stockAfter,

          note: typeof note === "string" ? note.trim() : "",

          soldAt,
        },
      ],
      {
        session,
      },
    );

    product.stock = stockAfter;

    product.lastSaleDate = soldAt;

    await product.save({
      session,
    });

    const [transaction] = await InventoryTransaction.create(
      [
        {
          owner: ownerId,

          productId: product._id,

          type: INVENTORY_TRANSACTION_TYPES.SALE,

          quantity: numericQuantity,

          previousStock: stockBefore,

          newStock: stockAfter,

          note: `Sale recorded for ${numericQuantity} unit${
            numericQuantity === 1 ? "" : "s"
          }`,

          saleId: sale._id,
        },
      ],
      {
        session,
      },
    );

    createdSaleId = sale._id;

    updatedProductId = product._id;

    transactionId = transaction._id;
  });

  const sale = await Sale.findById(createdSaleId).populate(
    "productId",
    "name sku category price",
  );

  const product = await Product.findById(updatedProductId).populate(
    "supplierId",
    "name company email phone status",
  );

  const transaction = await InventoryTransaction.findById(
    transactionId,
  ).populate("productId", "name sku category");

  return {
    sale,
    product,
    transaction,
  };
};

export { recordProductSale };
