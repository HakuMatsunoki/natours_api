import express from "express";

import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/", authController.signup);

export { router as userRouter };
