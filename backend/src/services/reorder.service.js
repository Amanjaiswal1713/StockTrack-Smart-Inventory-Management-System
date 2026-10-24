import { Product } from "../models/product.model.js";
import { ReorderPlan } from "../models/reorderPlan.model.js";
import { ApiError } from "../utils/ApiError.js";
const buildReorderItems = async (ownerId) => {
  const products = await Product.find({
    owner: ownerId,
    stock: {
      $gte: 0,
    },
    minStock: {
      $gt: 0,
    },
    $expr: {
      $lt: ["$stock", "$minStock"],
    },
  }).populate("supplierId", "company name");
  return products
    .map((product) => {
      const requiredQuantity = Math.max(
        Number(product.minStock) - Number(product.stock),
        0,
      );
      return {
        productId: product._id,
        supplierId: product.supplierId?._id || null,
        productName: product.name,
        sku: product.sku,
        supplierCompany: product.supplierId?.company || "",
        currentStock: Number(product.stock),
        minimumStock: Number(product.minStock),
        requiredQuantity,
      };
    })
    .filter((item) => item.requiredQuantity > 0);
};
const createReorderPlan = async ({ ownerId, note = "" }) => {
  const items = await buildReorderItems(ownerId);
  if (items.length === 0) {
    throw new ApiError(400, "No products currently require reordering");
  }
  const totalUnits = items.reduce(
    (total, item) => total + item.requiredQuantity,
    0,
  );
  return ReorderPlan.create({
    owner: ownerId,
    items,
    totalUnits,
    note: typeof note === "string" ? note.trim() : "",
  });
};
export { buildReorderItems, createReorderPlan };
