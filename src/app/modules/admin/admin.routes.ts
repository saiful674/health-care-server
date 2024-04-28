import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { adminControllers } from "./admin.controller";
import { adminValidationSchema } from "./admin.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.admin, UserRole.superAdmin),
  adminControllers.getAllAdmin
);

router.get(
  "/:id",
  auth(UserRole.admin, UserRole.superAdmin),
  adminControllers.getSingleAdmin
);

router.patch(
  "/:id",
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(adminValidationSchema.updateAdminSchema),
  adminControllers.updateSingleAdmin
);

router.delete(
  "/:id",
  auth(UserRole.admin, UserRole.superAdmin),
  adminControllers.deleteSingleAdmin
);

router.delete(
  "/soft/:id",
  auth(UserRole.admin, UserRole.superAdmin),
  adminControllers.softDeleteSingleAdmin
);

export const adminRouter = router;
