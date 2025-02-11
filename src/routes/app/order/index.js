import express from 'express'
import { CHECKOUT, ORDER_CANCEL, ORDER_SUCCESS, PLACE_ORDER } from '../../../constans/endpoints.js'
import { OrderCancel, OrderSuccess, placeOreder, renderCheckout } from '../../../controllers/app/order/index.js'

const route = express.Router()


route.get(CHECKOUT,renderCheckout)
route.post(PLACE_ORDER,placeOreder)

route.get(ORDER_SUCCESS,OrderSuccess)
route.get(ORDER_CANCEL,OrderCancel)

export default route
