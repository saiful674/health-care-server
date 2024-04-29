import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { userServices } from "./user.service";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdminIntoDb(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is created successfully",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
};
