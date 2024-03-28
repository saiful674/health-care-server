import { Admin, Prisma, PrismaClient } from "@prisma/client";
import calculatePagination from "../../../utils/calculatePagination";

const prisma = new PrismaClient();

const getAllAdminFromDb = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  let andConditions: Prisma.AdminWhereInput[] = [];

  const adminSearchableFields = ["name", "email"];
  const { sortBy, sortOrder } = options;
  const { page, limit, skip } = calculatePagination(options);

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

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdminFromDb = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateSingleAdminIntoDb = async (id: string, payload: Partial<Admin>) => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteAdminFromDb = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedAdminData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    const deletedUserData = await transactionClient.user.delete({
      where: {
        email: deletedAdminData.email,
      },
    });

    return deletedAdminData;
  });

  return result;
};

export const adminServices = {
  getAllAdminFromDb,
  getSingleAdminFromDb,
  updateSingleAdminIntoDb,
  deleteAdminFromDb,
};
