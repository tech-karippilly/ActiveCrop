import express from 'express'
import { ADD_CART, BASE_URL, DELETE_ITEM, UPDATE_CART } from '../../../constans/endpoints.js'
import { addToCart, removeItem, renderCartPage, updateCart } from '../../../controllers/app/cart/index.js'
import jwt from 'jsonwebtoken'
const route = express.Router()

route.get(BASE_URL,renderCartPage)
route.post(ADD_CART,addToCart)
route.patch(UPDATE_CART,updateCart)
route.delete(DELETE_ITEM,removeItem)


export default route