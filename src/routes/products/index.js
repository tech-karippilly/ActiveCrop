import express from "express";
import { blockProduct, createProductPage, createProducts, deleteProduct, getProductByCatagoery, getProductDetails, getProducts, removeImageFromProduct, searchProduct, updateProduct, updateProductPage } from "../../controllers/products/index.js";
import multer from "multer";
import fs from 'fs';
import { ADMIN_CREATE_PRODUCTS, ADMIN_DELETE_PRODUCTS, ADMIN_PRODUCT_BLOCK, ADMIN_PRODUCT_DETAILS, ADMIN_PRODUCT_IMAGE_REMOVE, ADMIN_PRODUCT_LIST, ADMIN_PRODUCT_SEARCH, ADMIN_UPDATE_PRODUCTS, PRODUCTS_BY_ID } from "../../constans/endpoints.js";

const route = express.Router()

const uploadDir = './src/uploads/products';
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

route.get(ADMIN_PRODUCT_SEARCH, searchProduct)
route.get(ADMIN_PRODUCT_LIST, getProducts)
route.get(ADMIN_CREATE_PRODUCTS, createProductPage)
route.get(ADMIN_UPDATE_PRODUCTS, updateProductPage)
route.get(ADMIN_PRODUCT_DETAILS, getProductDetails)
route.get(PRODUCTS_BY_ID,getProductByCatagoery)
route.post(ADMIN_CREATE_PRODUCTS, upload.array('product_image', 4), createProducts)
route.delete(ADMIN_PRODUCT_IMAGE_REMOVE,removeImageFromProduct)
route.put(ADMIN_PRODUCT_BLOCK,blockProduct)

route.put(ADMIN_UPDATE_PRODUCTS, upload.array('product_image', 4), updateProduct)
route.delete(ADMIN_DELETE_PRODUCTS, deleteProduct)



export default route