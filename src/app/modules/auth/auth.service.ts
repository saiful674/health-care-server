import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import prisma from "../../../utils/prisma";
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
  console.log(isUserExist);
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

export const authServices = {
  userLogin,
  refreshToken,
};
