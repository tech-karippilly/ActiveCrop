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

export const preventLoggedInAccess =async (req, res, next) => {
    if (req.session && req.session.accessToken) {

        return res.redirect(ADMIN_DASHBOARD);
    }
    next();
}
export const protect = async (req, res, next) => {
    try {
        if (req.session && req.session.accessToken) {
            let access_token = req.session.accessToken;

            try {
                // Verify access token
                const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN);
                const userId = jwtDecode.userId;
                const currentUser = await User.findById(userId);

                if (!currentUser) {
                    return res.redirect('/auth/login');
                }

                req.user = currentUser;
                return next();
            } catch (error) {
                if (error.name === 'TokenExpiredError' && req.session.refreshToken) {
                    console.log('Access token expired, attempting refresh...');

                    // Verify refresh token
                    const refreshToken = req.session.refreshToken;
                    const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);

                    // Find user from refresh token
                    const userId = refreshDecoded.userId;
                    const currentUser = await User.findById(userId);

                    if (!currentUser) {
                        return res.redirect('/auth/login');
                    }

                    // Generate new tokens
                    const newAccessToken = jwt.sign(
                        { userId: currentUser._id },
                        process.env.JWT_SECRET_ACCESS_TOKEN,
                        { expiresIn: '15m' } // Short lifespan for access token
                    );

                    const newRefreshToken = jwt.sign(
                        { userId: currentUser._id },
                        process.env.JWT_SECRET_REFRESH_TOKEN,
                        { expiresIn: '7d' } // Longer lifespan for refresh token
                    );

                    // Update session with new tokens
                    req.session.accessToken = newAccessToken;
                    req.session.refreshToken = newRefreshToken;

                    req.user = currentUser;
                    return next();
                } else {
                    return res.redirect('/auth/login'); // Redirect if token is invalid
                }
            }
        } else {
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export const Adminprotect = async (req, res, next) => {
    try {
        if (req.session && req.session.accessToken) {
            let access_token = req.session.accessToken;

            try {
                // Verify access token
                const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN);
                const userId = jwtDecode.userId;
                const currentUser = await User.findById(userId);

                if (!currentUser) {
                    return res.redirect('/admin');
                }

                req.user = currentUser;
                return next();
            } catch (error) {
                if (error.name === 'TokenExpiredError' && req.session.refreshToken) {
                    console.log('Access token expired, attempting refresh...');

                    // Verify refresh token
                    const refreshToken = req.session.refreshToken;
                    const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);

                    // Find user from refresh token
                    const userId = refreshDecoded.userId;
                    const currentUser = await User.findById(userId);

                    if (!currentUser) {
                        return res.redirect('/admin');
                    }

                    // Generate new tokens
                    const newAccessToken = jwt.sign(
                        { userId: currentUser._id },
                        process.env.JWT_SECRET_ACCESS_TOKEN,
                        { expiresIn: '20m' } // Short lifespan for access token
                    );

                    const newRefreshToken = jwt.sign(
                        { userId: currentUser._id },
                        process.env.JWT_SECRET_REFRESH_TOKEN,
                        { expiresIn: '7d' } // Longer lifespan for refresh token
                    );

                    // Update session with new tokens
                    req.session.accessToken = newAccessToken;
                    req.session.refreshToken = newRefreshToken;

                    req.user = currentUser;
                    return next();
                } else {
                    return res.redirect('/admin'); // Redirect if token is invalid
                }
            }
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

function renderResponse(pageName, res, status, alertMessage, alertType, redirectUrl) {
    res.status(status).render(pageName, { alertMessage, alertType, redirectUrl });
}
