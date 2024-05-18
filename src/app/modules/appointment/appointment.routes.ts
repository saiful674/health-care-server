import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { appointmentController } from "./appointment.controller";
import { appointmentValidation } from "./appointment.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin),
  appointmentController.getAllFromDB
);

router.get(
  "/my-appointment",
  auth(UserRole.patient, UserRole.doctor),
  appointmentController.getMyAppointment
);

router.post(
  "/create-appointment",
  auth(UserRole.patient),
  validateRequest(appointmentValidation.createAppointment),
  appointmentController.createAppointment
);

router.patch(
  "/status/:id",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor),
  appointmentController.changeAppointmentStatus
);

export const appointmentRoutes = router;
