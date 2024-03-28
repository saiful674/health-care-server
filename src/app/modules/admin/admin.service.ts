import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdminFromDb = async (params: any) => {
  console.log(params);
  const result = await prisma.admin.findMany({
    where: {
      name: {
        contains: params.searchTerm,
        mode: "insensitive",
      },
    },
  });
  return result;
};

export const adminServices = {
  getAllAdminFromDb,
};
