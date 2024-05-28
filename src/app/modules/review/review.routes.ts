import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = express.Router();

router.get("/", ReviewController.getAllFromDB);

router.post(
  "/create-review",
  auth(UserRole.patient),
  validateRequest(reviewValidation.create),
  ReviewController.insertIntoDB
);

export const reviewRoutes = router;
