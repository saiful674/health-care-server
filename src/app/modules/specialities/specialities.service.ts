import { Request } from "express";

import { Specialties } from "@prisma/client";
import prisma from "../../../utils/prisma";
import { imageUploader } from "../../halpers/imageUploader";
import { TFile } from "../../interface/file";

const inserIntoDB = async (req: Request) => {
  const file = req.file as TFile;

  if (file) {
    const uploadToCloudinary = await imageUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialitiesService = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
