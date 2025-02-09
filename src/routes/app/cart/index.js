import express from 'express'
import { ADD_CART, BASE_URL, GET_CART } from '../../../constans/endpoints.js'
import { addToCart, getCart, renderCartPage } from '../../../controllers/app/cart/index.js'

const route = express.Router()

route.get(BASE_URL,renderCartPage)
route.get(GET_CART,getCart)
route.post(ADD_CART,addToCart)

export default route