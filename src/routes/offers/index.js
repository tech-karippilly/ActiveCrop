

import express from "express";
import { ADMIN_OFFER_CATAGOERY_CREATE, ADMIN_OFFER_CATAGOERY_DELETE, ADMIN_OFFER_CATAGOERY_UPDATE, ADMIN_OFFER_PRODUCT_CREATE, ADMIN_OFFER_PRODUCT_DELETE, ADMIN_OFFER_PRODUCT_UPDATE, ADMIN_OFFER_REFERAL_CREATE, ADMIN_OFFER_REFERAL_DELETE, ADMIN_OFFER_REFERAL_UPDATE, BASE_URL } from "../../constans/endpoints.js";
import {  createProductOffer,  deleteProductOffer, editProductOffer,  renderCreatePage, renderEditPage, renderOfferPage,  } from "../../controllers/offers/index.js";
import { createCategoryOffer, deleteCategoryOffer, rendercreateCategoryPage, renderupdateCategoryPage, updateCategoryOffer } from "../../controllers/offers/catagoery/index.js";
import { createReferalOffer, deleteReferal, renderCreateReferalPage, renderUpdateReferalPage, updateReferal } from "../../controllers/offers/referal/index.js";

const route  = express.Router()

route.get(BASE_URL,renderOfferPage)
route.get(ADMIN_OFFER_PRODUCT_CREATE,renderCreatePage)
route.post(ADMIN_OFFER_PRODUCT_CREATE,createProductOffer)
route.get(ADMIN_OFFER_PRODUCT_UPDATE,renderEditPage)
route.put(ADMIN_OFFER_PRODUCT_UPDATE,editProductOffer)
route.delete(ADMIN_OFFER_PRODUCT_DELETE,deleteProductOffer)

route.get(ADMIN_OFFER_CATAGOERY_CREATE,rendercreateCategoryPage)
route.post(ADMIN_OFFER_CATAGOERY_CREATE,createCategoryOffer)
route.get(ADMIN_OFFER_CATAGOERY_UPDATE,renderupdateCategoryPage)
route.put(ADMIN_OFFER_CATAGOERY_UPDATE,updateCategoryOffer)
route.delete(ADMIN_OFFER_CATAGOERY_DELETE,deleteCategoryOffer)

route.get(ADMIN_OFFER_REFERAL_CREATE,renderCreateReferalPage)
route.post(ADMIN_OFFER_REFERAL_CREATE,createReferalOffer)
route.get(ADMIN_OFFER_REFERAL_UPDATE,renderUpdateReferalPage)
route.post(ADMIN_OFFER_REFERAL_UPDATE,updateReferal)
route.delete(ADMIN_OFFER_REFERAL_DELETE,deleteReferal)

export default route