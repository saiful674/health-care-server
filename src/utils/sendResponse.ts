import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  resData: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: {
      total: number;
      limit: number;
      page: number;
    };
    data: T;
  }
) => {
  const { statusCode, success, data, meta, message } = resData;
  return res.status(statusCode).json({
    success,
    message,
    meta,
    data,
  });
};

export default sendResponse;
