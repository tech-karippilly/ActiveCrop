import express from 'express'
import { CHECKOUT, PLACE_ORDER } from '../../../constans/endpoints.js'
import { placeOreder, renderCheckout } from '../../../controllers/app/order/index.js'

const route = express.Router()


route.get(CHECKOUT,renderCheckout)
route.post(PLACE_ORDER,placeOreder)

export default route
