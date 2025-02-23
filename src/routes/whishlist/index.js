import express from "express";
import { ADD_WISHLIST, BASE_URL } from "../../constans/endpoints.js";
import { addToWishlist, renderWishlist } from "../../controllers/app/whishlist/index.js";
import { protect } from "../../middleware/adminAuthMiddleware.js";

const route = express.Router()



route.get(BASE_URL, renderWishlist)
route.get(ADD_WISHLIST,protect, addToWishlist)

export default route