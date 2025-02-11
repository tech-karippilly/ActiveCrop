import express from "express";
import { ADMIN_ORDERS_STATUS, BASE_URL, DYNAMIC_ID } from "../../constans/endpoints.js";
import { orderDetailsPage, orderStatus, renderOrderPage } from "../../controllers/orders/index.js";
const route = express.Router()

route.get(BASE_URL,renderOrderPage)
route.get(DYNAMIC_ID,orderDetailsPage)
route.post(ADMIN_ORDERS_STATUS,orderStatus)
export default route