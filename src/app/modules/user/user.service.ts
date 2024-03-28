import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createAdminIntoDb = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // const userData = {
  //   email: payload.admin.email,
  //   password: hashedPassword,
  //   role: "admin",
  // };

  const result = prisma.$transaction(async (prismaTransection) => {
    const createdUser = await prismaTransection.user.create({
      data: {
        email: payload.admin.email,
        password: hashedPassword,
        role: "admin",
      },
    });

    const createdAdmin = await prismaTransection.admin.create({
      data: payload.admin,
    });

    return createdAdmin;
  });

  return result;
};

export const userServices = {
  createAdminIntoDb,
};
