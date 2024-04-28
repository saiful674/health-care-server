import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { authServices } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.userLogin(req.body);
  const { accessToken, needPasswordChange, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, { secure: false, httpOnly: true });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged id successfull",
    data: { accessToken, needPasswordChange },
  });
});

export const authController = {
  login,
};
