import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { scheduleController } from "./schedule.controller";

const router = express.Router();

router.get("/", auth(UserRole.doctor), scheduleController.getAllFromDB);

router.get(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor),
  scheduleController.getByIdFromDB
);

router.post(
  "/create-schedule",
  auth(UserRole.superAdmin, UserRole.admin),
  scheduleController.inserIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  scheduleController.deleteFromDB
);

export const scheduleRoutes = router;
