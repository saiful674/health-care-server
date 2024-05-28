import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { TAuthUser } from "../../interface/common";
import { metaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await metaService.fetchDashboardMetaData(user as TAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta data retrival successfully!",
      data: result,
    });
  }
);

export const metaController = {
  fetchDashboardMetaData,
};
