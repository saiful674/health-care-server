import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { metaController } from "./meta.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor, UserRole.patient),
  metaController.fetchDashboardMetaData
);

export const metaRoutes = router;
