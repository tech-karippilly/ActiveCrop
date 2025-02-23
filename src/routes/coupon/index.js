import express from 'express'
import { ADMIN_COUPON_CREATE, ADMIN_COUPON_DYNAMIC, BASE_URL } from '../../constans/endpoints.js'
import { createCoupon, deleteCoupon, renderCoupon, renderCreateCoupon, updateCoupon } from '../../controllers/coupon/index.js'
const route = express.Router()

route.get(BASE_URL,renderCoupon)

route.get(ADMIN_COUPON_CREATE,renderCreateCoupon)
route.post(ADMIN_COUPON_CREATE,createCoupon)
route.put(ADMIN_COUPON_DYNAMIC,updateCoupon)
route.delete(ADMIN_COUPON_DYNAMIC,deleteCoupon)

export default route