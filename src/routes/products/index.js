import express from "express";
import { blockProduct, createProductPage, createProducts, deleteProduct, getProductByCatagoery, getProductDetails, getProducts, removeImageFromProduct, searchProduct, updateProduct, updateProductPage } from "../../controllers/products/index.js";
import { ADMIN_CREATE_PRODUCTS, ADMIN_DELETE_PRODUCTS, ADMIN_PRODUCT_BLOCK, ADMIN_PRODUCT_DETAILS, ADMIN_PRODUCT_IMAGE_REMOVE, ADMIN_PRODUCT_LIST, ADMIN_PRODUCT_SEARCH, ADMIN_UPDATE_PRODUCTS, PRODUCTS_BY_ID } from "../../constans/endpoints.js";
import { uploadProduct } from "../../config/multerCofig.js";

const route = express.Router()



route.get(ADMIN_PRODUCT_SEARCH, searchProduct)
route.get(ADMIN_PRODUCT_LIST, getProducts)
route.get(ADMIN_CREATE_PRODUCTS, createProductPage)
route.get(ADMIN_UPDATE_PRODUCTS, updateProductPage)
route.get(ADMIN_PRODUCT_DETAILS, getProductDetails)
route.get(PRODUCTS_BY_ID,getProductByCatagoery)
route.post(ADMIN_CREATE_PRODUCTS, uploadProduct.array('product_image', 4), createProducts)
route.delete(ADMIN_PRODUCT_IMAGE_REMOVE,removeImageFromProduct)
route.put(ADMIN_PRODUCT_BLOCK,blockProduct)

route.put(ADMIN_UPDATE_PRODUCTS, uploadProduct.array('product_image', 4), updateProduct)
route.delete(ADMIN_DELETE_PRODUCTS, deleteProduct)



export default route