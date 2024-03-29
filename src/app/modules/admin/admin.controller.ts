import { NextFunction, Request, Response } from "express";
import pick from "../../../shared/pick";
import sendResponse from "../../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const getSingleAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await adminServices.getSingleAdminFromDb(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin is retrived successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const updateSingleAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await adminServices.updateSingleAdminIntoDb(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin is updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteSingleAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await adminServices.deleteAdminFromDb(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin is deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const softDeleteSingleAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await adminServices.softDeleteAdminFromDb(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin is deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const adminControllers = {
  getAllAdmin,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
  softDeleteSingleAdmin,
};
