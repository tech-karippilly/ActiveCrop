import express from 'express'
import { ADD_CART, BASE_URL, CHECKOUT, DELETE_ITEM, PLACE_ORDER, UPDATE_CART } from '../../../constans/endpoints.js'
import { addToCart, placeOreder, removeItem, renderCartPage, renderCheckout, updateCart } from '../../../controllers/app/cart/index.js'

const route = express.Router()

route.get(BASE_URL,renderCartPage)
route.post(ADD_CART,addToCart)
route.patch(UPDATE_CART,updateCart)
route.delete(DELETE_ITEM,removeItem)

route.get(CHECKOUT,renderCheckout)
route.post(PLACE_ORDER,placeOreder)

export default route