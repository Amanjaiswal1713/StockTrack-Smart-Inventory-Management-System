import { Router } from "express";

import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "../controllers/supplier.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

/*
 * Every supplier route requires login.
 */
router.use(verifyJWT);

router.route("/").get(getSuppliers).post(createSupplier);

router
  .route("/:supplierId")
  .get(getSupplierById)
  .patch(updateSupplier)
  .delete(deleteSupplier);

export default router;
