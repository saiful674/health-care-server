import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { Request } from "express";
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

export const userServices = {
  createAdminIntoDb,
};
