import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
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
    "asdfhjsaeuf",
    "15m"
  );

  const refreshToken = jwtHalper.genarateToken(
    {
      email: isUserExist.email,
      role: isUserExist.role,
    },
    "asdfhjsaeufdasf",
    "15d"
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
    decodedUser = jwtHalper.varifyToken(token, "asdfhjsaeufdasf");
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
    "asdfhjsaeuf",
    "15m"
  );

  return { accessToken };
};

export const authServices = {
  userLogin,
  refreshToken,
};
