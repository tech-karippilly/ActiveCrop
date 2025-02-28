import express from "express";

import { tokenCheckMiddleware } from "../../../middleware/tokenCheckMiddleware.js";
import { filterProducts, productDetailsPage, productsPage } from "../../../controllers/app/products/index.js";
import { USER_PRODUCT, USER_PRODUCT_DETAILS, USER_PRODUCT_FILTER } from "../../../constans/endpoints.js";

const route = express.Router()


route.get(USER_PRODUCT_FILTER,filterProducts)
route.get(USER_PRODUCT,productsPage)
route.get(USER_PRODUCT_DETAILS,productDetailsPage)


export default route