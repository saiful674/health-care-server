import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { imageUploader } from "../../halpers/imageUploader";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { userValidations } from "./user.validations";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.admin, UserRole.superAdmin),
  userControllers.getAllUser
);

router.get(
  "/me",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor, UserRole.patient),
  userControllers.getMyProfile
);

router.post(
  "/create-admin",
  // auth(UserRole.admin, UserRole.superAdmin),
  imageUploader.uploadToMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createAdmin.parse(JSON.parse(req.body.data));
    return userControllers.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.superAdmin, UserRole.admin),
  imageUploader.uploadToMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createDoctor.parse(JSON.parse(req.body.data));
    return userControllers.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  imageUploader.uploadToMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidations.createPatient.parse(JSON.parse(req.body.data));
    return userControllers.createPatient(req, res, next);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(userValidations.updateStatus),
  userControllers.changeProfileStatus
);

router.patch(
  "/update-my-profile",
  auth(UserRole.superAdmin, UserRole.admin, UserRole.doctor, UserRole.patient),
  imageUploader.uploadToMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return userControllers.updateMyProfie(req, res, next);
  }
);

export const userRouter = router;
