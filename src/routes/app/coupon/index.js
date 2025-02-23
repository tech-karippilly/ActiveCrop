import express from "express";
import { APPLY_COUPON, BASE_URL } from "../../../constans/endpoints.js";
import { applyCoupons, getCoupons } from "../../../controllers/app/coupon/index.js";

const route = express.Router()

route.get(BASE_URL,getCoupons)
route.get(APPLY_COUPON,applyCoupons)


export default route