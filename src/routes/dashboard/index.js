import express from "express";
import { dasboardPage } from "../../controllers/dashboard/index.js";
import { adminAuthMiddleware, Adminprotect } from "../../middleware/adminAuthMiddleware.js";


const route = express.Router()


route.get('/',Adminprotect,dasboardPage)

export default route