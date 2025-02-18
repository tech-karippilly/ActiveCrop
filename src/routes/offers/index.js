

import express from "express";
import { ADMIN_OFFER_PRODUCT_CREATE, ADMIN_OFFER_PRODUCT_DELETE, ADMIN_OFFER_PRODUCT_UPDATE, BASE_URL } from "../../constans/endpoints.js";
import { createProductOffer, deleteProductOffer, editProductOffer, renderCreatePage, renderOfferPage } from "../../controllers/offers/index.js";

const route  = express.Router()

route.get(BASE_URL,renderOfferPage)
route.get(ADMIN_OFFER_PRODUCT_CREATE,renderCreatePage)
route.post(ADMIN_OFFER_PRODUCT_CREATE,createProductOffer)
route.put(ADMIN_OFFER_PRODUCT_UPDATE,editProductOffer)
route.delete(ADMIN_OFFER_PRODUCT_DELETE,deleteProductOffer)

export default route