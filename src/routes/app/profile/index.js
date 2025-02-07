import express from "express";
import multer from "multer";
import fs from 'fs';

import { BASE_URL, USER_ADDRESS_BASE, USER_ADDRESS_CREATE, USER_ADDRESS_DYNAMIC, USER_PROFILE_EDIT } from "../../../constans/endpoints.js";
import { renderProfilePage, updateProfileDetails } from "../../../controllers/app/profile/index.js";
import { createAddress, defaultAddress, deleteAddress, editAddress, renderAddressPage, renderCreateAddressPage, renderEditAddressPage } from "../../../controllers/app/profile/address/index.js";

const route = express.Router()

const uploadDir = './src/uploads/profile';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })


route.get(BASE_URL,renderProfilePage)
route.put(USER_PROFILE_EDIT,upload.single('profile_image'),updateProfileDetails)

route.get(USER_ADDRESS_BASE,renderAddressPage)
route.get(USER_ADDRESS_CREATE,renderCreateAddressPage)
route.post(USER_ADDRESS_CREATE,upload.none(),createAddress)
route.patch(USER_ADDRESS_DYNAMIC,defaultAddress)
route.delete(USER_ADDRESS_DYNAMIC,deleteAddress)
route.get(USER_ADDRESS_DYNAMIC,renderEditAddressPage)
route.put(USER_ADDRESS_DYNAMIC,upload.none(),editAddress)

export default route