import express from "express";

import * as authController from "../controllers/authController";
import * as authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware.isUserDataValid, authController.signup);

export { router as userRouter };
