import express from "express";

import * as userController from "../controllers/userController";
import * as authMiddleware from "../middlewares/authMiddleware";

import { UserRoles } from "../constants";

const router = express.Router();

router.get(
  "/all",
  authMiddleware.protectRoute,
  authMiddleware.restrictTo(UserRoles.ADMIN),
  userController.all
);

export { router as userRouter };
