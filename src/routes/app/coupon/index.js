import express from "express";
import { APPLY_COUPON, BASE_URL } from "../../../constans/endpoints.js";
import { applyCoupons, getCoupons } from "../../../controllers/app/coupon/index.js";
import { protect } from "../../../middleware/adminAuthMiddleware.js";

const route = express.Router()

route.get(BASE_URL,protect, getCoupons)
route.get(APPLY_COUPON,protect,applyCoupons)


export default route