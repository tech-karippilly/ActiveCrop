

import express from "express";
import { ADMIN_OFFER_PRODUCT_CREATE, ADMIN_OFFER_PRODUCT_UPDATE, BASE_URL } from "../../constans/endpoints.js";
import { createProductOffer, editProductOffer, renderOfferPage } from "../../controllers/offers/index.js";

const route  = express.Router()

route.get(BASE_URL,renderOfferPage)
route.post(ADMIN_OFFER_PRODUCT_CREATE,createProductOffer)
route.put(ADMIN_OFFER_PRODUCT_UPDATE,editProductOffer)

export default route