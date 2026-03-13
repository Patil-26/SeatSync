import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rideshare/avatars",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rideshare/documents",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadDocument = multer({ storage: documentStorage });
