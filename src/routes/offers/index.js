

import express from "express";
import { ADMIN_OFFER_CATAGOERY_CREATE, ADMIN_OFFER_CATAGOERY_DELETE, ADMIN_OFFER_CATAGOERY_UPDATE, ADMIN_OFFER_PRODUCT_CREATE, ADMIN_OFFER_PRODUCT_DELETE, ADMIN_OFFER_PRODUCT_UPDATE, BASE_URL } from "../../constans/endpoints.js";
import { createCategoryOffer, createProductOffer, deleteCategoryOffer, deleteProductOffer, editProductOffer, renderCreatePage, renderEditPage, renderOfferPage, updateCategoryOffer } from "../../controllers/offers/index.js";

const route  = express.Router()

route.get(BASE_URL,renderOfferPage)
route.get(ADMIN_OFFER_PRODUCT_CREATE,renderCreatePage)
route.post(ADMIN_OFFER_PRODUCT_CREATE,createProductOffer)
route.get(ADMIN_OFFER_PRODUCT_UPDATE,renderEditPage)
route.put(ADMIN_OFFER_PRODUCT_UPDATE,editProductOffer)
route.delete(ADMIN_OFFER_PRODUCT_DELETE,deleteProductOffer)

route.post(ADMIN_OFFER_CATAGOERY_CREATE,createCategoryOffer)
route.put(ADMIN_OFFER_CATAGOERY_UPDATE,updateCategoryOffer)
route.delete(ADMIN_OFFER_CATAGOERY_DELETE,deleteCategoryOffer)


export default route