import fs from "fs";
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import { TCloudinaryResponse, TFile } from "../interface/file";

cloudinary.config({
  cloud_name: config.image_uploader.cloud_name,
  api_key: config.image_uploader.api_key,
  api_secret: config.image_uploader.api_secret,
});

const uploadToCloudinary = async (
  file: TFile
): Promise<TCloudinaryResponse> => {
  console.log(file);
  return await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: TCloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const uploadToMulter = multer({ storage: storage });

export const imageUploader = {
  uploadToCloudinary,
  uploadToMulter,
};
