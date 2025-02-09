import express from 'express'
import { BASE_URL } from '../../../constans/endpoints.js'
import { renderCartPage } from '../../../controllers/app/cart/index.js'

const route = express.Router()

route.get(BASE_URL,renderCartPage)


export default route