import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { imageUploader } from "../../halpers/imageUploader";
import auth from "../../middlewares/auth";
import { specialitiesController } from "./specialities.controller";
import { specialitiesValidtaionSchema } from "./specialities.validation";

const router = express.Router();

router.get("/", specialitiesController.getAllFromDB);

router.post(
  "/create-speciality",
  imageUploader.uploadToMulter.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialitiesValidtaionSchema.create.parse(
      JSON.parse(req.body.data)
    );
    return specialitiesController.inserIntoDB(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  specialitiesController.deleteFromDB
);

export const specialitiesRoutes = router;
