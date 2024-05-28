import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PrescriptionController } from "./prescription.controller";
import { prescriptionValidation } from "./prescription.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin),
  PrescriptionController.getAllFromDB
);

router.get(
  "/my-prescription",
  auth(UserRole.patient),
  PrescriptionController.patientPrescription
);

router.post(
  "/create-prescription",
  auth(UserRole.doctor),
  validateRequest(prescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const prescriptionRoutes = router;
