import multer from 'multer'
import fs from "fs";


const profileUploadDir = './src/uploads/profile';
const categoryUploadDir = './src/uploads/category';
const productUploadDir = './src/uploads/product';

[profileUploadDir, categoryUploadDir, productUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const createStorage = (uploadDir) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
    }
  };

  export const uploadProfile = multer({ storage: createStorage(profileUploadDir), fileFilter });
  export const uploadCategory = multer({ storage: createStorage(categoryUploadDir), fileFilter });
  export const uploadProduct = multer({ storage: createStorage(productUploadDir), fileFilter });