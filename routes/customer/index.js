import express from "express";
import multer from 'multer'
import fs from 'fs';
import { createCustomer, createCustomerPage, deleteCustomer, getCoustomers, searchCustomers, toggleUserBlockStatus, updateCustomer, updateCustomerPage } from "../../controllers/customer/index.js";
import { ADMIN_CREATE_CUSTOMER, ADMIN_CUSTOMER_LIST, ADMIN_CUSTOMER_SEARCH, ADMIN_UPDATE_CUSTOMER } from "../../constans/endpoints.js";
const route = express.Router()

const uploadDir = './uploads/profile';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Creates the directory and its parents if needed
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


route.get(ADMIN_CREATE_CUSTOMER, createCustomerPage)
route.post(ADMIN_CREATE_CUSTOMER, upload.single('profile_image'), createCustomer)
route.get(ADMIN_CUSTOMER_SEARCH, searchCustomers)
route.get(ADMIN_CUSTOMER_LIST, getCoustomers)

route.get(ADMIN_UPDATE_CUSTOMER, updateCustomerPage)
route.post('/:id',upload.single('profile_image'),updateCustomer)

route.patch('/:id',toggleUserBlockStatus)
route.delete('/:id',deleteCustomer)



export default route