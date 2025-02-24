import express from "express";
import { ADD_WISHLIST, BASE_URL, TO_CART } from "../../constans/endpoints.js";
import { addToWishlist, moveToCart, renderWishlist } from "../../controllers/app/whishlist/index.js";
import { protect } from "../../middleware/adminAuthMiddleware.js";

const route = express.Router()



route.get(BASE_URL, protect,renderWishlist)
route.get(ADD_WISHLIST,protect, addToWishlist)
route.get(TO_CART,protect,moveToCart)

export default route