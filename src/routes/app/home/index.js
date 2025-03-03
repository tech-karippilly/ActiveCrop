import express from "express";
import { USER_HOME, USER_SEARCH } from "../../../constans/endpoints.js";
import { catagoerySearch, renderHomepage } from "../../../controllers/app/home/index.js";

const route = express.Router()


route.get(USER_HOME,renderHomepage)
route.get(USER_SEARCH,catagoerySearch)


export default route