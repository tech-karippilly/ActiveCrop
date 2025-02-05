import Passport from "passport";
import GoogleStrategy from 'passport-google-oidc'
import dotenv from 'dotenv';
import { User } from "../models/index.js";
dotenv.config();


function createSatergyGoogle() {
    // Passport.use(new GoogleStrategy({
    //     clientID:process.env.GOOGLE_CLIENT_ID,
    //     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    //     callbackURL:'http://localhost:3000/api/auth/google/callback'
    // } ,(accessToken,refreshToken,profile,done)=>{
    //     return done(null,profile)
    // }))

    Passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {

        try {
            if (accessToken) {

                const id = refreshToken.id
                const email = refreshToken.emails[0].value
                let user = await User.findOne({
                    $or: [
                        { googleId: id },
                        { email: email }
                    ]
                });

                if (!user) {
                    const newUser = User.create({
                        googleId: id,
                        firstName: refreshToken.name.givenName,
                        lastName: refreshToken.name.familyName,
                        userName: refreshToken.displayName,
                        email,

                    })
                }
                user.googleId = id

                if (user.isBlocked) {
                    return done(null, false, { message: 'Your account has been blocked. Please contact support.' });
                }
                return done(null, user);
            }
        } catch (error) {
            return done(err, null);
        }

    }));

    Passport.serializeUser((user, done) => {
        done(null, user.id); // Serialize only the user's ID
    });

    Passport.deserializeUser(async (id, done) => {
        // Fetch the user from your database using the ID
        // Replace `User.findById` with your actual database call
        const user = await User.findById(id)
        done(null, user);
    });

}

export default createSatergyGoogle




