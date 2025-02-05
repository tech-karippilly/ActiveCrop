import express from "express";
import ConnectDb from "./config/db.js";
import dotenv from 'dotenv';
import session from "express-session";
import { fileURLToPath } from 'url';
import path from 'path';
import passport from 'passport'

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

import { ADMIN_AUTH_BASE, ADMIN_CATAGOERY_BASE, ADMIN_CUSTOMER_BASE, ADMIN_PRODUCTS_BASE, USER_HOME, USER_LOGIN_BASE, USER_OTP_BASE, USER_PRODUCTS } from "./constans/endpoints.js";

const app = express()

//DATABASE CONFIG
ConnectDb()

//MIDDLEWARES
// app.use(cors())
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
app.set('views', 'views')

//STATIC FILES 
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));


// ADMIN ROUTES
app.use(ADMIN_AUTH_BASE, adiminAuthRoute)
app.use('/api/admin/role', roleAuth)
app.use('/admin/dashboard',dashboardRoute)
app.use(ADMIN_CATAGOERY_BASE, categoeryRoute)
app.use(ADMIN_PRODUCTS_BASE, productRoute)
app.use(ADMIN_CUSTOMER_BASE,customerRoute)

//USER ROUTES
app.use(USER_LOGIN_BASE, userRoute)
app.use(USER_OTP_BASE, otpRoute)
app.use('/api/auth/token', tokenRoute)
app.use(USER_PRODUCTS,userProductsRoute)



app.use('/page',pageRoute)

// INITIAL ROUTES
app.get(USER_HOME,homeRoute)

app.get('/admin',(req,res)=>{
    res.status(200).redirect(ADMIN_AUTH_BASE)
})


export default app