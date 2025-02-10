import express from 'express'
import { CHECKOUT, ORDER_SUCCESS, PLACE_ORDER } from '../../../constans/endpoints.js'
import { OrderSuccess, placeOreder, renderCheckout } from '../../../controllers/app/order/index.js'

const route = express.Router()


route.get(CHECKOUT,renderCheckout)
route.post(PLACE_ORDER,placeOreder)

route.get(ORDER_SUCCESS,OrderSuccess)

export default route
