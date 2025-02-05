import express from "express";
import { dasboardPage } from "../../controllers/dashboard/index.js";
import { adminAuthMiddleware } from "../../middleware/adminAuthMiddleware.js";


const route = express.Router()


route.get('/',dasboardPage)

export default route