import express from "express";
import multer from "multer";
import fs from 'fs';

import { BASE_URL, USER_ADDRESS_BASE, USER_ADDRESS_CREATE, USER_ADDRESS_DYNAMIC, USER_ORDER_DETAILS, USER_ORDERS, USER_PROFILE_EDIT, USER_REFERAL, USER_REST_PASSWORD, USER_WALLET } from "../../../constans/endpoints.js";
import { renderProfilePage, updateProfileDetails } from "../../../controllers/app/profile/index.js";
import { createAddress, defaultAddress, deleteAddress, editAddress, renderAddressPage, renderCreateAddressPage, renderEditAddressPage, renderOrderDetails, renderOrders } from "../../../controllers/app/profile/address/index.js";
import { resetPassword, resetPasswordPage } from "../../../controllers/app/profile/password/index.js";
import { protect } from "../../../middleware/adminAuthMiddleware.js";
import { renderWalletPage } from "../../../controllers/app/profile/wallet/index.js";
import { renderReferalPage } from "../../../controllers/app/profile/referal/index.js";

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


route.get(BASE_URL,protect,renderProfilePage)
route.put(USER_PROFILE_EDIT,protect,upload.single('profile_image'),updateProfileDetails)

route.get(USER_ADDRESS_BASE,protect,renderAddressPage)

route.get(USER_ADDRESS_CREATE,protect,renderCreateAddressPage)
route.post(USER_ADDRESS_CREATE,protect,upload.none(),createAddress)

route.patch(USER_ADDRESS_DYNAMIC,protect,defaultAddress)
route.delete(USER_ADDRESS_DYNAMIC,protect,deleteAddress)

route.get(USER_ADDRESS_DYNAMIC,protect,renderEditAddressPage)
route.put(USER_ADDRESS_DYNAMIC,upload.none(),editAddress)

route.get(USER_ORDER_DETAILS,protect,renderOrderDetails)
route.get(USER_ORDERS,renderOrders)

route.get(USER_WALLET,renderWalletPage)

route.get(USER_REFERAL,renderReferalPage)

route.get(USER_REST_PASSWORD,protect,resetPasswordPage)
route.patch(USER_REST_PASSWORD,protect,upload.none(),resetPassword)

export default route