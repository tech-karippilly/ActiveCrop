import express from "express";
import { adminLogin, adminLogout, createAdmin, createpage, loginPage } from "../../../controllers/auth/admin/index.js";
import { authAdminMiddleware, tokenCheckMiddleware } from "../../../middleware/tokenCheckMiddleware.js";
import { ADMIN_CREATE, ADMIN_LOGIN, ADMIN_LOGIN_POST, ADMIN_LOGOUT } from "../../../constans/endpoints.js";
import { adminAuthMiddleware, preventLoggedInAccess } from "../../../middleware/adminAuthMiddleware.js";

const route = express.Router()

route.get(ADMIN_LOGIN,loginPage)
route.post(ADMIN_LOGIN_POST,adminLogin)

route.get(ADMIN_CREATE,createpage)
route.post(ADMIN_CREATE,createAdmin)

route.get(ADMIN_LOGOUT,adminAuthMiddleware,adminLogout)

export default route