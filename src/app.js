import express from "express";
import ConnectDb from "./config/db.js";
import dotenv from 'dotenv';
import session from "express-session";
import { fileURLToPath } from 'url';
import path from 'path';
import passport from 'passport'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

dotenv.config();

import roleAuth from './routes/roles/index.js'
import adiminAuthRoute from './routes/auth/admin/index.js'
import userRoute from './routes/auth/user/index.js'
import otpRoute from './routes/auth/otp/index.js'
import tokenRoute from './routes/auth/token/index.js'
import categoeryRoute from './routes/catagoery/index.js'
import productRoute from './routes/products/index.js'
import dashboardRoute from './routes/dashboard/index.js'
import pageRoute from './routes/page/index.js'
import customerRoute from './routes/customer/index.js'
import userProductsRoute from './routes/app/products/index.js'
import homeRoute from './routes/app/home/index.js'
import profileRoute from './routes/app/profile/index.js'
import cartRoute from './routes/app/cart/index.js'
import orderRoute from './routes/app/order/index.js'
import adminOrderRoute from './routes/orders/index.js'
import offerRoutes  from './routes/offers/index.js'
import whishlistRoutes from './routes/whishlist/index.js'
import couponRoutes from './routes/coupon/index.js'
import userCouponRoutes from './routes/app/coupon/index.js'
import reportRoutes from './routes/reports/index.js'
import walletRoutes from './routes/app/wallet/index.js'


import { ADMIN_AUTH_BASE, ADMIN_CATAGOERY_BASE, ADMIN_COUPON_BASE, ADMIN_CUSTOMER_BASE, ADMIN_OFFERS_BASE, ADMIN_ORDERS_BASE, ADMIN_PRODUCTS_BASE, ADMIN_REPORT_BASE, ORDERS_BASE, USER_CART_BASE, USER_COUPON_BASE, USER_HOME, USER_LOGIN_BASE, USER_OTP_BASE, USER_PRODUCTS, USER_PROFILE, USER_SEARCH, WALLET_BASE, WHISLIST_BASE } from "./constans/endpoints.js";
import { OrderSuccess } from "./controllers/app/order/index.js";
import { NOT_FOUNT_PAGE } from "./constans/page.js";
import swaggerSpec from "./utils/swagger.js";
import swaggerDocument from "./utils/swaggerDocuments.js";
import { catagoerySearch } from "./controllers/app/home/index.js";
import { Adminprotect } from "./middleware/adminAuthMiddleware.js";

const app = express()

//DATABASE CONFIG
ConnectDb()

//MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extends: true }))

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});


//FILE IMPORT
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//SESSION CREATE
app.use(session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(passport.initialize())
app.use(passport.session())

//VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files correctly
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// SWAGGER DOCS
const combinedSwaggerSpec = {
    ...swaggerSpec,
    ...swaggerDocument
 }

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(combinedSwaggerSpec))

// ADMIN ROUTES


app.use(ADMIN_AUTH_BASE, adiminAuthRoute)
app.use('/api/admin/role', roleAuth)
app.use('/admin/dashboard',dashboardRoute)
app.use(ADMIN_CATAGOERY_BASE,Adminprotect, categoeryRoute)
app.use(ADMIN_PRODUCTS_BASE, Adminprotect,productRoute)
app.use(ADMIN_CUSTOMER_BASE,Adminprotect,customerRoute)
app.use(ADMIN_ORDERS_BASE,Adminprotect,adminOrderRoute)
app.use(ADMIN_OFFERS_BASE,Adminprotect,offerRoutes)
app.use(ADMIN_COUPON_BASE,Adminprotect,couponRoutes)
app.use(ADMIN_REPORT_BASE,Adminprotect,reportRoutes)


//USER ROUTES
app.use(USER_LOGIN_BASE, userRoute)
app.use(USER_OTP_BASE, otpRoute)
app.use('/api/auth/token', tokenRoute)
app.use(USER_PRODUCTS,userProductsRoute)
app.use(USER_PROFILE,profileRoute)
app.use(USER_CART_BASE,cartRoute)
app.use(ORDERS_BASE,orderRoute)
app.use(WHISLIST_BASE,whishlistRoutes)
app.use(USER_COUPON_BASE,userCouponRoutes)
app.use(WALLET_BASE,walletRoutes)

app.use('/page',pageRoute)

// INITIAL ROUTES
app.get(USER_HOME,homeRoute)
app.get(USER_SEARCH,catagoerySearch)

app.get('/order-success',OrderSuccess)

app.get('/admin',(req,res)=>{
    res.status(200).redirect(ADMIN_AUTH_BASE)
})

app.get('/user',(req,res)=>{
    res.status(200).render('user/profile/orders/details')
})

export default app