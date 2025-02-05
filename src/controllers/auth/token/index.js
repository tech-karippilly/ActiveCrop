import { Token, User } from "../../../models/index.js"
import { isTokenExp } from "../../../utils/token.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

async function tokenRefresh(req,res){
    
    const { access_token ,refresh_token} = req.body
    try {
        // Find the token with the given refresh_token and access_token
        const token = await Token.findOne({
            refresh_token: refresh_token,
            access_token: access_token
        });
    
        // If the token is not found, return a 401 error
        if (!token) {
            return res.status(401).json({ message: "Token not found. Login again." });
        }
    
        // Check if the access token is expired
        if (isTokenExp(token.createdAt, 'access_token')) {
    
            // If the refresh token is expired, request re-login
            if (isTokenExp(token.createdAt, 'refresh_token')) {
                return res.status(401).json({ message: "Refresh token has expired. Login again." });
            }
    
            // Refresh the access token
            const user = await User.findById(token.userId).select('email role');
            
            // If the user doesn't exist, send an error response
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
    
            const accessToken = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET_ACCESS_TOKEN,
                { expiresIn: '15m' }
            );
    
            // Update the access token in the database
            token.access_token = accessToken;
            await token.save();
    
            return res.status(200).json({
                message: "Token Updated",
                access_token: accessToken,
                refresh_token
            });
    
        }
    
        // If both tokens are still valid, return a message indicating so
        return res.status(200).json({ message: "Both tokens are still valid." });
    
    } catch (error) {
        console.error('Error in Refresh Token:', error); // Log the full error for debugging
        res.status(500).send('Internal Server Error');
    }
    
}



export {
    tokenRefresh
}