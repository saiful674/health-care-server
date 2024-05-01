import { Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { patientService } from "./patient.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await patientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await patientService.softDelete(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

export const patientController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
