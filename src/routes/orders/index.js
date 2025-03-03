import express from "express";
import { ADMIN_ORDERS_STATUS, ADMIN_RETURN_ORDER_STATUS, BASE_URL, DYNAMIC_ID } from "../../constans/endpoints.js";
import { orderDetailsPage, orderStatus, renderOrderPage, returnOrderStatus } from "../../controllers/orders/index.js";
const route = express.Router()

route.get(BASE_URL,renderOrderPage)
route.get(DYNAMIC_ID,orderDetailsPage)
route.post(ADMIN_ORDERS_STATUS,orderStatus)
route.post(ADMIN_RETURN_ORDER_STATUS,returnOrderStatus)
export default route