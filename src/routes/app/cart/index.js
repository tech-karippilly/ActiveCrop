import express from 'express'
import { ADD_CART, BASE_URL, DELETE_ITEM, GET_CART, UPDATE_CART } from '../../../constans/endpoints.js'
import { addToCart, getCart, removeItem, renderCartPage, updateCart } from '../../../controllers/app/cart/index.js'

const route = express.Router()

route.get(BASE_URL,renderCartPage)
route.get(GET_CART,getCart)
route.post(ADD_CART,addToCart)
route.patch(UPDATE_CART,updateCart)
route.delete(DELETE_ITEM,removeItem)
export default route