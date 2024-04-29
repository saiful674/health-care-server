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

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token genarate successfull",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await authServices.changePasswordIntoDb(req.body, user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password change successfull",
      data: result,
    });
  }
);
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.forgetPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset link send to email successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  const result = await authServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfull",
    data: result,
  });
});

export const authController = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
