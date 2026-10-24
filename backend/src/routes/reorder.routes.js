import { Router } from "express";

import {
  createPlan,
  deletePlan,
  getPlanById,
  getPlans,
  updatePlan,
} from "../controllers/reorder.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getPlans).post(createPlan);

router
  .route("/:reorderId")
  .get(getPlanById)
  .patch(updatePlan)
  .delete(deletePlan);

export default router;
