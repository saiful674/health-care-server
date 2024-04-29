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

router.post("/forget-password", authController.forgetPassword);

router.post("/reset-password", authController.resetPassword);

export const authRouter = router;
