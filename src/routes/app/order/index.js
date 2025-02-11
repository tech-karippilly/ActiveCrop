import express from 'express'
import { CHECKOUT, ORDER_CANCEL, ORDER_SUCCESS, PLACE_ORDER } from '../../../constans/endpoints.js'
import { OrderCancel, OrderSuccess, placeOreder, renderCheckout } from '../../../controllers/app/order/index.js'
import { protect } from '../../../middleware/adminAuthMiddleware.js'

const route = express.Router()


route.get(CHECKOUT,protect,renderCheckout)
route.post(PLACE_ORDER,protect,placeOreder)

route.get(ORDER_SUCCESS,protect,OrderSuccess)
route.get(ORDER_CANCEL,protect,OrderCancel)

export default route
