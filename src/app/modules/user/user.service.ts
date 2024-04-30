import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";

import { Request } from "express";
import calculatePagination from "../../../utils/calculatePagination";
import { TAuthUser } from "../../interface/common";
import { TFile } from "../../interface/file";
import { TPaginationOptions } from "../../interface/pagination";
import { imageUploader } from "./../../halpers/imageUploader";

const prisma = new PrismaClient();

const createAdminIntoDb = async (req: Request) => {
  const file = req.file;
  const data = req.body;

  if (file) {
    const uploadToCloudinary = await imageUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword = await bcrypt.hash(data.password, 12);

  console.log(hashedPassword);
  const result = prisma.$transaction(async (prismaTransection) => {
    const createdUser = await prismaTransection.user.create({
      data: {
        email: data.admin.email,
        password: hashedPassword,
        role: "admin",
      },
    });

    const createdAdmin = await prismaTransection.admin.create({
      data: data.admin,
    });

    return createdAdmin;
  });

  return result;
};

const createDoctor = async (req: Request) => {
  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await imageUploader.uploadToCloudinary(file);
    console.log(uploadToCloudinary);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.doctor,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

const createPatient = async (req: Request) => {
  const file = req.file as TFile;

  if (file) {
    const uploadedProfileImage = await imageUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.patient,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createdPatientData;
  });

  return result;
};

const getAllUserFromDb = async (params: any, options: TPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  let andConditions: Prisma.UserWhereInput[] = [];

  const adminSearchableFields = ["email"];
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

  const whereConditons: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    select: {
      id: true,
      status: true,
      email: true,
      role: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      doctor: true,
      admin: true,
      patient: true,
    },
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.user.count({
    where: whereConditons,
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

const changeProfileStatus = async (id: string, status: UserRole) => {
  console.log(id);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfile = async (user: TAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.active,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.superAdmin) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.admin) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.doctor) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.patient) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateMyProfie = async (user: TAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.active,
    },
  });

  const file = req.file as TFile;
  if (file) {
    const uploadToCloudinary = await imageUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.superAdmin) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.admin) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.doctor) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.patient) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const userServices = {
  createAdminIntoDb,
  createPatient,
  createDoctor,
  changeProfileStatus,
  getAllUserFromDb,
  getMyProfile,
  updateMyProfie,
};
