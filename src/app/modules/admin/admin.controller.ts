import { Request, Response } from "express";
import pick from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, [
    "name",
    "email",
    "searchTerm",
    "contactNumber",
  ]);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await adminServices.getAllAdminFromDb(filter, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminServices.getSingleAdminFromDb(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is retrived successfully",
    data: result,
  });
});

const updateSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminServices.updateSingleAdminIntoDb(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is updated successfully",
    data: result,
  });
});

const deleteSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminServices.deleteAdminFromDb(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
});

const softDeleteSingleAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminServices.softDeleteAdminFromDb(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin is deleted successfully",
      data: result,
    });
  }
);

export const adminControllers = {
  getAllAdmin,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
  softDeleteSingleAdmin,
};
