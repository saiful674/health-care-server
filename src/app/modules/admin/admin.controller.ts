import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { adminServices } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, [
      "name",
      "email",
      "searchTerm",
      "contactNumber",
    ]);

    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await adminServices.getAllAdminFromDb(filter, options);
    res.status(200).json({
      success: true,
      message: "Admins are retrived successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

const getSingleAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminServices.getSingleAdminFromDb(id);
    res.status(200).json({
      success: true,
      message: "Admin is retrived successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};
const updateSingleAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminServices.updateSingleAdminIntoDb(id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin is updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

const deleteSingleAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminServices.deleteAdminFromDb(id);
    res.status(200).json({
      success: true,
      message: "Admin is deleted successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

export const adminControllers = {
  getAllAdmin,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
};
