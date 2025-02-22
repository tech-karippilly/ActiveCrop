import express from 'express'
import { CHECKOUT, ORDER_CANCEL, ORDER_FAILD, ORDER_SUCCESS, PLACE_ORDER, RAZORPAY_VERIFY } from '../../../constans/endpoints.js'
import { OrderCancel, OrderFailed, OrderSuccess, placeOreder, renderCheckout, verifyPayment } from '../../../controllers/app/order/index.js'
import { protect } from '../../../middleware/adminAuthMiddleware.js'

const route = express.Router()


route.get(CHECKOUT,protect,renderCheckout)
route.post(PLACE_ORDER,protect,placeOreder)
route.post(RAZORPAY_VERIFY,protect,verifyPayment)
route.get(ORDER_SUCCESS,protect,OrderSuccess)
route.get(ORDER_FAILD,protect,OrderFailed)
route.get(ORDER_CANCEL,protect,OrderCancel)

export default route
