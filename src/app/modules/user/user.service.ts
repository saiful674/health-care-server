import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createAdminIntoDb = async (payload) => {
  const userData = {
    email: payload.admin.email,
    password: payload.password,
    role: "admin",
  };

  const result = prisma.$transaction(async (prismaTransection) => {
    const createdUser = await prismaTransection.user.create({
      data: {
        email: payload.admin.email,
        password: payload.password,
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
