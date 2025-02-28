import express from 'express'
import { CHECKOUT, ORDER_CANCEL, ORDER_FAILD, ORDER_RETRY, ORDER_RETURN, ORDER_RETURN_STATUS, ORDER_SUCCESS, PLACE_ORDER, RAZORPAY_VERIFY } from '../../../constans/endpoints.js'
import { OrderCancel, OrderFailed, OrderReturn, OrderReturnStatus, OrderSuccess, placeOreder, renderCheckout, RetryOrder, verifyPayment } from '../../../controllers/app/order/index.js'
import { protect } from '../../../middleware/adminAuthMiddleware.js'

const route = express.Router()


route.get(CHECKOUT,protect,renderCheckout)
route.post(PLACE_ORDER,protect,placeOreder)
route.post(RAZORPAY_VERIFY,protect,verifyPayment)
route.get(ORDER_SUCCESS,protect,OrderSuccess)
route.get(ORDER_FAILD,protect,OrderFailed)
route.get(ORDER_CANCEL,protect,OrderCancel)
route.get(ORDER_RETRY,protect,RetryOrder)
route.post(ORDER_RETURN,protect,OrderReturn)
route.get(ORDER_RETURN_STATUS,protect,OrderReturnStatus)

export default route
