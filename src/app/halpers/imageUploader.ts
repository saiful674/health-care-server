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

cloudinary.config({
  cloud_name: "dkxya25xc",
  api_key: "865857878247459",
  api_secret: "1HHAUEf_Uxowoh3e5hDXflFl4L4",
});

const uploadToCloudinary = async (file: any) => {
  console.log(file);
  return await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { public_id: file.originalname },
      (error, result) => {
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
