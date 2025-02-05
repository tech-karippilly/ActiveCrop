import express from "express";
import { USER_HOME } from "../../../constans/endpoints.js";
import { renderHomepage } from "../../../controllers/app/home/index.js";

const route = express.Router()


route.get(USER_HOME,renderHomepage)



export default route