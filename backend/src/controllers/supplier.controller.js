import mongoose from "mongoose";
import { Supplier } from "../models/supplier.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";

const normalizeSupplierData = (data = {}) => {
  const normalized = {};
  if (data.name !== undefined) {
    normalized.name = data.name.trim();
  }
  if (data.company !== undefined) {
    normalized.company = data.company.trim();
  }
  if (data.email !== undefined) {
    normalized.email = data.email.trim().toLowerCase();
  }
  if (data.phone !== undefined) {
    normalized.phone = data.phone.trim();
  }
  if (data.address !== undefined) {
    normalized.address = data.address.trim();
  }
  if (data.status !== undefined) {
    normalized.status = data.status;
  }
  return normalized;
};
const createSupplier = asyncHandler(async (req, res) => {
  const { name, company, email, phone, address, status } = req.body;
  if (typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "Supplier contact name is required");
  }
  if (typeof company !== "string" || !company.trim()) {
    throw new ApiError(400, "Company name is required");
  }
  const normalizedCompany = company.trim();
  const existingSupplier = await Supplier.findOne({
    owner: req.user._id,
    company: {
      $regex: new RegExp(
        `^${normalizedCompany.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i",
      ),
    },
  });
  if (existingSupplier) {
    throw new ApiError(409, "A supplier with this company name already exists");
  }
  const supplier = await Supplier.create({
    name: name.trim(),
    company: normalizedCompany,
    email: typeof email === "string" ? email.trim().toLowerCase() : "",
    phone: typeof phone === "string" ? phone.trim() : "",
    address: typeof address === "string" ? address.trim() : "",
    status: status || "Active",
    owner: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, supplier, "Supplier created successfully"));
});
const getSuppliers = asyncHandler(async (req, res) => {
  const {
    search = "",
    status = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;
  const filter = {
    owner: req.user._id,
  };
  if (status === "Active" || status === "Inactive") {
    filter.status = status;
  }
  if (typeof search === "string" && search.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchExpression = new RegExp(escapedSearch, "i");
    filter.$or = [
      {
        name: searchExpression,
      },
      {
        company: searchExpression,
      },
      {
        email: searchExpression,
      },
      {
        phone: searchExpression,
      },
    ];
  }
  const allowedSortFields = [
    "name",
    "company",
    "status",
    "createdAt",
    "updatedAt",
  ];
  const selectedSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const suppliers = await Supplier.find(filter)
    .sort({
      [selectedSortField]: sortDirection,
    })
    .lean();
  return res
    .status(200)
    .json(new ApiResponse(200, suppliers, "Suppliers fetched successfully"));
});
const getSupplierById = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  if (!mongoose.isValidObjectId(supplierId)) {
    throw new ApiError(400, "Invalid supplier ID");
  }
  const supplier = await Supplier.findOne({
    _id: supplierId,
    owner: req.user._id,
  });
  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier fetched successfully"));
});
const updateSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  if (!mongoose.isValidObjectId(supplierId)) {
    throw new ApiError(400, "Invalid supplier ID");
  }
  const supplier = await Supplier.findOne({
    _id: supplierId,
    owner: req.user._id,
  });
  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }
  const updateData = normalizeSupplierData(req.body);
  if (updateData.name !== undefined && !updateData.name) {
    throw new ApiError(400, "Supplier contact name cannot be empty");
  }
  if (updateData.company !== undefined && !updateData.company) {
    throw new ApiError(400, "Company name cannot be empty");
  }
  if (updateData.company !== undefined) {
    const escapedCompany = updateData.company.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    const duplicateSupplier = await Supplier.findOne({
      owner: req.user._id,
      company: {
        $regex: new RegExp(`^${escapedCompany}$`, "i"),
      },
      _id: {
        $ne: supplier._id,
      },
    });
    if (duplicateSupplier) {
      throw new ApiError(
        409,
        "A supplier with this company name already exists",
      );
    }
  }
  Object.assign(supplier, updateData);
  await supplier.save();
  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier updated successfully"));
});
const deleteSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  if (!mongoose.isValidObjectId(supplierId)) {
    throw new ApiError(400, "Invalid supplier ID");
  }
  const assignedProduct = await Product.findOne({
    owner: req.user._id,
    supplierId,
  }).select("_id name");
  if (assignedProduct) {
    throw new ApiError(
      409,
      `Supplier cannot be deleted because it is assigned to product: ${assignedProduct.name}`,
    );
  }
  const supplier = await Supplier.findOneAndDelete({
    _id: supplierId,
    owner: req.user._id,
  });
  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier deleted successfully"));
});
export {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
