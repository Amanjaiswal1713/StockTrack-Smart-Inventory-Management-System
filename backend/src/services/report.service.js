import { Product } from "../models/product.model.js";

import { Supplier } from "../models/supplier.model.js";

import { Sale } from "../models/sale.model.js";

import { InventoryTransaction } from "../models/inventoryTransaction.model.js";

import { DEFAULT_DEAD_STOCK_DAYS } from "../constants.js";

const getDeadStockDate = (days) => {
  const date = new Date();

  date.setDate(date.getDate() - days);

  return date;
};

const getDeadStockProducts = async ({
  ownerId,
  days = DEFAULT_DEAD_STOCK_DAYS,
}) => {
  const numericDays = Number(days);

  const thresholdDays =
    Number.isFinite(numericDays) && numericDays > 0
      ? numericDays
      : DEFAULT_DEAD_STOCK_DAYS;

  const thresholdDate = getDeadStockDate(thresholdDays);

  const products = await Product.find({
    owner: ownerId,

    stock: {
      $gt: 0,
    },

    $or: [
      {
        lastSaleDate: {
          $lte: thresholdDate,
        },
      },

      {
        lastSaleDate: null,

        createdAt: {
          $lte: thresholdDate,
        },
      },
    ],
  })
    .populate("supplierId", "name company email phone status")
    .sort({
      lastSaleDate: 1,
      createdAt: 1,
    });

  return {
    thresholdDays,
    products,
  };
};

const buildBusinessReport = async (ownerId) => {
  const [products, suppliers, sales, inventoryLogs, deadStockResult] =
    await Promise.all([
      Product.find({
        owner: ownerId,
      })
        .populate("supplierId", "name company email phone status")
        .lean(),

      Supplier.find({
        owner: ownerId,
      }).lean(),

      Sale.find({
        owner: ownerId,
      })
        .populate("productId", "name sku category")
        .sort({
          soldAt: -1,
        })
        .lean(),

      InventoryTransaction.find({
        owner: ownerId,
      })
        .populate("productId", "name sku category")
        .sort({
          createdAt: -1,
        })
        .lean(),

      getDeadStockProducts({
        ownerId,
      }),
    ]);

  const totalStockUnits = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0) * Number(product.price || 0),
    0,
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= Number(product.minStock),
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0,
  );

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.revenue || 0),
    0,
  );

  const totalUnitsSold = sales.reduce(
    (total, sale) => total + Number(sale.quantity || 0),
    0,
  );

  const averageProductValue =
    products.length > 0 ? inventoryValue / products.length : 0;

  const averageTransaction = sales.length > 0 ? totalRevenue / sales.length : 0;

  return {
    generatedAt: new Date().toISOString(),

    productReport: {
      totalProducts: products.length,

      totalStockUnits,

      inventoryValue,

      averageProductValue,

      lowStockProducts: lowStockProducts.length,

      outOfStockProducts: outOfStockProducts.length,

      deadStockProducts: deadStockResult.products.length,

      products,
    },

    supplierReport: {
      totalSuppliers: suppliers.length,

      suppliers,
    },

    salesReport: {
      totalTransactions: sales.length,

      totalUnitsSold,

      totalRevenue,

      averageTransaction,

      sales,
    },

    inventoryReport: {
      inventoryValue,

      totalStockUnits,

      totalMovements: inventoryLogs.length,

      movements: inventoryLogs,
    },

    deadStockReport: {
      thresholdDays: deadStockResult.thresholdDays,

      totalProducts: deadStockResult.products.length,

      products: deadStockResult.products,
    },
  };
};

export { buildBusinessReport, getDeadStockProducts };
