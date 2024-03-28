import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllAdminFromDb(req.query);
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
