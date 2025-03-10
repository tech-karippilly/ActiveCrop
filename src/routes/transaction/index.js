import express from "express";
import { BASE_URL } from "../../constans/endpoints.js";
import { renderTransactionPage } from "../../controllers/transaction/index.js";

const route = express.Router()

route.get(BASE_URL,renderTransactionPage)

export default route