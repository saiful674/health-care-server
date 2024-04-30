import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

import { Request } from "express";
import { TFile } from "../../interface/file";
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

export const userServices = {
  createAdminIntoDb,
  createPatient,
  createDoctor,
  changeProfileStatus,
};
