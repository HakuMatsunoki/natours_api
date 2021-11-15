import express from "express";

import * as authController from "../controllers/authController";
import * as authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/signup",
  authMiddleware.isUserDataValid,
  authMiddleware.isNotEmailExist,
  authController.signup
);

export { router as userRouter };
