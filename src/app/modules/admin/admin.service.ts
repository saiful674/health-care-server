import { Admin, Prisma, PrismaClient } from "@prisma/client";
import calculatePagination from "../../../utils/calculatePagination";
import { TPaginationOptions } from "../../interface/pagination";
import { TAdminFilterParams } from "./admin.interface";

const prisma = new PrismaClient();

const getAllAdminFromDb = async (
  params: TAdminFilterParams,
  options: TPaginationOptions
) => {
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
          equals: (filterData as any)[key],
          mode: "insensitive",
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

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
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateSingleAdminIntoDb = async (id: string, payload: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

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
    await transactionClient.user.delete({
      where: {
        email: deletedAdminData.email,
      },
    });

    return deletedAdminData;
  });

  return result;
};

const softDeleteAdminFromDb = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedAdminData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: deletedAdminData.email,
      },
      data: {
        // status: UserStatus.deleted,
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
  softDeleteAdminFromDb,
};
