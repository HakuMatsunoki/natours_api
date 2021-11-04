import express from "express";

import * as authController from "../controllers/authController";

const router = express.Router();

router.get("/", authController.signin);

export { router as userRouter };
