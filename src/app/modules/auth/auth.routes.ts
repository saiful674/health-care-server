import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { authController } from "./auth.controller";

const router = express.Router();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.admin, UserRole.superAdmin, UserRole.doctor, UserRole.patient),
  authController.changePassword
);

export const authRouter = router;
