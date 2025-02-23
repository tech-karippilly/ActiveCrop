import express from 'express'
import { ADMIN_COUPON_CREATE, ADMIN_COUPON_DYNAMIC } from '../../constans/endpoints.js'
import { createCoupon, deleteCoupon, updateCoupon } from '../../controllers/coupon/index.js'
const route = express.Router()

route.post(ADMIN_COUPON_CREATE,createCoupon)
route.put(ADMIN_COUPON_DYNAMIC,updateCoupon)
route.delete(ADMIN_COUPON_DYNAMIC,deleteCoupon)

export default route