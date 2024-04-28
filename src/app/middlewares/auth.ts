import { UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import prisma from "../../utils/prisma";
import AppError from "../errors/AppError";
import { jwtHalper } from "../halpers/jwtHalper";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization;
    try {
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      const decodedUser = jwtHalper.varifyToken(
        token,
        config.jwt.jwt_secret as Secret
      ) as JwtPayload;

      if (roles.length && !roles.includes(decodedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Access Forbidden!");
      }

      req.user = decodedUser;

      const isUserExist = await prisma.user.findUniqueOrThrow({
        where: {
          email: decodedUser.email,
          status: UserStatus.active,
        },
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
