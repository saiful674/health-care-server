import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.admin, UserRole.superAdmin),
  userControllers.createAdmin
);

export const userRouter = router;
