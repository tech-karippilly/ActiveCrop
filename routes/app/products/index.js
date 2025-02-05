import express from "express";

import { tokenCheckMiddleware } from "../../../middleware/tokenCheckMiddleware.js";
import { productDetailsPage, productsPage } from "../../../controllers/app/products/index.js";
import { USER_PRODUCT_DETAILS } from "../../../constans/endpoints.js";

const route = express.Router()

route.get('/:id',productsPage)
route.get(USER_PRODUCT_DETAILS,productDetailsPage)

export default route