import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminControllers } from "./admin.controller";
import { adminValidationSchema } from "./admin.validation";

const router = express.Router();

router.get("/", adminControllers.getAllAdmin);
router.get("/:id", adminControllers.getSingleAdmin);
router.patch(
  "/:id",
  validateRequest(adminValidationSchema.updateAdminSchema),
  adminControllers.updateSingleAdmin
);
router.delete("/:id", adminControllers.deleteSingleAdmin);
router.delete("/soft/:id", adminControllers.softDeleteSingleAdmin);

export const adminRouter = router;
