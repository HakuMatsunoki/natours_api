import express from "express";

import * as tourController from "../controllers/tourController";
import * as authMiddleware from "../middlewares/authMiddleware";
// import * as tourMiddleware from "../middlewares/tourMiddleware";
import { UserRoles } from "../constants";

const router = express.Router();

router.get("/", tourController.getAllTours);
router.post(
  "/",
  authMiddleware.protectRoute,
  authMiddleware.restrictTo(UserRoles.ADMIN, UserRoles.LEAD_GUIDE),
  tourController.createTour
);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authMiddleware.protectRoute,
    authMiddleware.restrictTo(UserRoles.ADMIN, UserRoles.LEAD_GUIDE),
    tourController.updateTour
  )
  .delete(
    authMiddleware.protectRoute,
    authMiddleware.restrictTo(UserRoles.ADMIN, UserRoles.LEAD_GUIDE),
    tourController.deleteTour
  );

export { router as tourRouter };
