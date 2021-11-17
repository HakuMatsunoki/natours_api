import express from "express";

import * as tourController from "../controllers/tourController";

const router = express.Router();

router.post("/", tourController.createTour);
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

export { router as tourRouter };
