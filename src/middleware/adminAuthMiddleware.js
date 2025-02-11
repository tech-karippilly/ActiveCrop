import { Role, Token, User } from '../models/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { ADMIN_LOGIN_PAGE } from '../constans/page.js'
import { HTTP_UNAUTHORIZED, HTTP_FORBIDDEN, HTTP_SERVER_ERROR } from '../constans/httpStatus.js';
import { ALERT_DANGER } from '../utils/alert.js';
import { ADMIN_LOGIN_POST } from '../constans/endpoints.js';
import { ADMIN_LOGIN } from '../constans/index.js';
dotenv.config();

export const adminAuthMiddleware = async (req, res, next) => {
    try {
        const access_token = req.session.accessToken

        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)

            const roleId = jwtDecode.role
            const currentUserRole = await Role.findById(roleId)

            if (currentUserRole) {
                if (currentUserRole.roleName === 'SuperAdmin' || currentUserRole.roleName === 'admin') {
                    next()
                }
                return renderResponse(ADMIN_LOGIN_PAGE,res,HTTP_UNAUTHORIZED,'Unauthorized',ALERT_DANGER,'')
            }
            return renderResponse(ADMIN_LOGIN_PAGE,res,HTTP_UNAUTHORIZED,'Unauthorized',ALERT_DANGER,'')
        }
    }
    catch (error) {
        return renderResponse(ADMIN_LOGIN_PAGE,res,HTTP_SERVER_ERROR,'Internal Server Error',ALERT_DANGER,'')
    }
};

export const preventLoggedInAccess = (req, res, next) => {
    if (req.session && req.session.accessToken) {
        return res.redirect(ADMIN_DASHBOARD);
    }
    next();
}
export const protect = (req,res,next)=>{
    if(req.session && req.session.accessToken){
        next()
    }else{
        res.redirect('/auth/login')
    }
}

function renderResponse(pageName, res, status, alertMessage, alertType, redirectUrl) {
    res.status(status).render(pageName, { alertMessage, alertType, redirectUrl });
}
