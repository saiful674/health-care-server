import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import prisma from "../../../utils/prisma";
import AppError from "../../errors/AppError";
import { jwtHalper } from "../../halpers/jwtHalper";

const userLogin = async (payload: { email: string; password: string }) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.active,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new Error("Password Incorrect!");
  }

  const accessToken = jwtHalper.genarateToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHalper.genarateToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedUser;
  try {
    decodedUser = jwtHalper.varifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (error) {
    throw new Error("You are not authorised!");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedUser?.email,
      status: UserStatus.active,
    },
  });

  const accessToken = jwtHalper.genarateToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { accessToken };
};

const changePasswordIntoDb = async (payload: any, user: any) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password not matched!");
  }
  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: isUserExist.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return {
    message: "Password changed successfull",
  };
};

export const authServices = {
  userLogin,
  refreshToken,
  changePasswordIntoDb,
};
