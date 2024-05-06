import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor, UserRole.patient),
  DoctorScheduleController.getAllFromDB
);

router.get(
  "/my-schedule",
  auth(UserRole.doctor),
  DoctorScheduleController.getMySchedule
);

router.post(
  "/create-schedule",
  auth(UserRole.doctor),
  validateRequest(DoctorScheduleValidation.create),
  DoctorScheduleController.insertIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.doctor),
  DoctorScheduleController.deleteFromDB
);

export const doctorScheduleRoutes = router;
