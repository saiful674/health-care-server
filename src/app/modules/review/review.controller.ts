import { Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { TAuthUser } from "../../interface/common";
import { reviewFilterableFields } from "./review.constant";
import { reviewService } from "./review.service";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await reviewService.insertIntoDB(
      user as TAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await reviewService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
};
