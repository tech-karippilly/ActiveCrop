

import express from "express";
import { BASE_URL } from "../../constans/endpoints.js";
import { renderOfferPage } from "../../controllers/offers/index.js";

const route  = express.Router()

route.get(BASE_URL,renderOfferPage)

export default route