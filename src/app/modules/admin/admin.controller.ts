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
};
