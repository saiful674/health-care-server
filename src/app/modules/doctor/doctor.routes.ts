import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { doctorController } from "./doctor.controller";
import { doctorValidationSchema } from "./doctor.validation";

const router = express.Router();

// task 3
router.get("/", doctorController.getAllFromDB);

//task 4
router.get("/:id", doctorController.getByIdFromDB);

router.patch(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor),
  validateRequest(doctorValidationSchema.update),
  doctorController.updateIntoDB
);

//task 5
router.delete(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  doctorController.deleteFromDB
);

// task 6
router.delete(
  "/soft/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  doctorController.softDelete
);

export const doctorRoutes = router;
