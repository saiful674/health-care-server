import bcrypt from "bcrypt";
import prisma from "../../../utils/prisma";
import { jwtHalper } from "../../halpers/jwtHalper";

const userLogin = async (payload: { email: string; password: string }) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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

export const authServices = {
  userLogin,
};
