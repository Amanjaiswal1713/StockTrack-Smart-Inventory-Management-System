import mongoose from "mongoose";

import { Sale } from "../models/sale.model.js";

import { Product } from "../models/product.model.js";

import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { recordProductSale } from "../services/sale.service.js";

const createSale = asyncHandler(async (req, res) => {
  const { productId, quantity, note } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product is required");
  }

  if (quantity === undefined || quantity === null || quantity === "") {
    throw new ApiError(400, "Sale quantity is required");
  }

  const result = await recordProductSale({
    ownerId: req.user._id,

    productId,

    quantity,

    note,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, result, "Sale recorded successfully"));
});

const getSales = asyncHandler(async (req, res) => {
  const { productId, sortOrder = "desc" } = req.query;

  const filter = {
    owner: req.user._id,
  };

  if (productId) {
    if (!mongoose.isValidObjectId(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    filter.productId = productId;
  }

  const sales = await Sale.find(filter)
    .populate("productId", "name sku category price")
    .sort({
      soldAt: sortOrder === "asc" ? 1 : -1,
    });

  return res
    .status(200)
    .json(new ApiResponse(200, sales, "Sales fetched successfully"));
});

const getSaleById = asyncHandler(async (req, res) => {
  const { saleId } = req.params;

  if (!mongoose.isValidObjectId(saleId)) {
    throw new ApiError(400, "Invalid sale ID");
  }

  const sale = await Sale.findOne({
    _id: saleId,
    owner: req.user._id,
  }).populate("productId", "name sku category price");

  if (!sale) {
    throw new ApiError(404, "Sale not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sale, "Sale fetched successfully"));
});

const getSalesSummary = asyncHandler(async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);

  const [summary] = await Sale.aggregate([
    {
      $match: {
        owner: ownerId,
      },
    },

    {
      $group: {
        _id: null,

        totalRevenue: {
          $sum: "$revenue",
        },

        totalUnitsSold: {
          $sum: "$quantity",
        },

        totalTransactions: {
          $sum: 1,
        },

        averageSale: {
          $avg: "$revenue",
        },
      },
    },

    {
      $project: {
        _id: 0,

        totalRevenue: 1,

        totalUnitsSold: 1,

        totalTransactions: 1,

        averageSale: 1,
      },
    },
  ]);

  const topSales = await Sale.aggregate([
    {
      $match: {
        owner: ownerId,
      },
    },

    {
      $group: {
        _id: "$productId",

        sold: {
          $sum: "$quantity",
        },

        revenue: {
          $sum: "$revenue",
        },
      },
    },

    {
      $sort: {
        sold: -1,
      },
    },

    {
      $limit: 5,
    },
  ]);

  const productIds = topSales.map((entry) => entry._id);

  const products = await Product.find({
    _id: {
      $in: productIds,
    },

    owner: req.user._id,
  }).lean();

  const productMap = new Map(
    products.map((product) => [String(product._id), product]),
  );

  const topProducts = topSales
    .map((entry) => {
      const product = productMap.get(String(entry._id));

      if (!product) {
        return null;
      }

      return {
        ...product,

        sold: entry.sold,

        salesRevenue: entry.revenue,
      };
    })
    .filter(Boolean);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRevenue: summary?.totalRevenue || 0,

        totalUnitsSold: summary?.totalUnitsSold || 0,

        totalSaleTransactions: summary?.totalTransactions || 0,

        averageSale: summary?.averageSale || 0,

        topProducts,
      },
      "Sales summary fetched successfully",
    ),
  );
});

export { createSale, getSales, getSaleById, getSalesSummary };
