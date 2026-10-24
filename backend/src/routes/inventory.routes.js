import { Router } from "express";

import {
  adjustStock,
  getInventoryTransactions,
  getProductInventoryHistory,
} from "../controllers/inventory.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/adjust", adjustStock);

router.get("/transactions", getInventoryTransactions);

router.get("/products/:productId/history", getProductInventoryHistory);

export default router;
