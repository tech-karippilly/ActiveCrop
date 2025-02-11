import express from 'express'
import { ADD_CART, BASE_URL, DELETE_ITEM, UPDATE_CART } from '../../../constans/endpoints.js'
import { addToCart, removeItem, renderCartPage, updateCart } from '../../../controllers/app/cart/index.js'
import jwt from 'jsonwebtoken'
import { protect } from '../../../middleware/adminAuthMiddleware.js'
const route = express.Router()

route.get(BASE_URL,protect,renderCartPage)
route.post(ADD_CART,protect,addToCart)
route.patch(UPDATE_CART,protect,updateCart)
route.delete(DELETE_ITEM,protect,removeItem)


export default route