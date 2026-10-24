import { Router } from "express";

import {
  updatePreferences,
  updateProfile,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.patch("/profile", updateProfile);

router.patch("/preferences", updatePreferences);

export default router;
