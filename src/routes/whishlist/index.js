import express from "express";
import { ADD_WISHLIST, BASE_URL, TO_CART, WHISHLIST_REMOVE } from "../../constans/endpoints.js";
import { addToWishlist, moveToCart, removeFromWishlist, renderWishlist } from "../../controllers/app/whishlist/index.js";
import { protect } from "../../middleware/adminAuthMiddleware.js";

const route = express.Router()



route.get(BASE_URL, protect,renderWishlist)
route.get(ADD_WISHLIST,protect, addToWishlist)
route.get(TO_CART,protect,moveToCart)
route.delete(WHISHLIST_REMOVE,protect,removeFromWishlist)

export default route