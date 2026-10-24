import { Router } from "express";

import {
  createSale,
  getSaleById,
  getSales,
  getSalesSummary,
} from "../controllers/sale.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getSales).post(createSale);

router.get("/summary", getSalesSummary);

router.get("/:saleId", getSaleById);

export default router;
