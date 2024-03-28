import { Prisma, PrismaClient } from "@prisma/client";
import calculatePagination from "../../../utils/calculatePagination";

const prisma = new PrismaClient();

const getAllAdminFromDb = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  let andConditions: Prisma.AdminWhereInput[] = [];

  const adminSearchableFields = ["name", "email"];
  const { sortBy, sortOrder } = options;
  const { limit, skip } = calculatePagination(options);

  if (params?.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
          mode: "insensitive",
        },
      })),
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  return result;
};

export const adminServices = {
  getAllAdminFromDb,
};
