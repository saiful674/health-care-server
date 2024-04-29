import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { imageUploader } from "../../halpers/imageUploader";
import auth from "../../middlewares/auth";
import { userControllers } from "./user.controller";
import { userValidations } from "./user.validations";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.admin, UserRole.superAdmin),
  imageUploader.uploadToMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createAdmin.parse(JSON.parse(req.body.data));
    return userControllers.createAdmin(req, res, next);
  }
);

export const userRouter = router;
