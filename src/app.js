import express from "express";
import cors from 'cors'
import ConnectDb from "./config/db.js";
import dotenv from 'dotenv';
import session from "express-session";
import { fileURLToPath } from 'url';
import path from 'path';
import passport from 'passport'

dotenv.config();

const app = express()

ConnectDb()

app.use(express.json())
app.use(express.urlencoded({ extends: true }))
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'))

export default app