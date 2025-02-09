import { Role, Token, User } from '../../../models/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { ADMIN_DASHBOARD, ADMIN_LOGIN } from '../../../constans/index.js';
import { isAdminLoginFormValid, isAdminSignupFormValid } from '../../../utils/formValidations.js';
import { ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING } from '../../../utils/alert.js';
import { ADMIN_LOGIN_PAGE, ADMIN_SIGNUP_PAGE } from '../../../constans/page.js';
import { HTTP_BAD_REQUEST, HTTP_CONFICT, HTTP_FORBIDDEN, HTTP_SERVER_ERROR, HTTP_SUCCESS } from '../../../constans/httpStatus.js';
dotenv.config();


function loginPage(req, res) {
    renderResponse(ADMIN_LOGIN_PAGE, res, HTTP_SUCCESS, '', '', '');
}

async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;
       
        // Validate form inputs
        if (!isAdminLoginFormValid(email, password)) {
            return renderResponse(ADMIN_LOGIN_PAGE,res, HTTP_BAD_REQUEST, 'Invalid username or password. Please try again.', ALERT_DANGER, '');
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return renderResponse(ADMIN_LOGIN_PAGE,res, HTTP_CONFICT, 'User not found', ALERT_WARNING, '');
        }

        // Check if user is verified
        if (!user.isVerifyed) {
            return renderResponse(ADMIN_LOGIN_PAGE,res, HTTP_FORBIDDEN, 'User is not verified', ALERT_WARNING, '');
        }

        // Validate password
        // const isPasswordValid = await user.comparePassword(password);
        // if (!isPasswordValid) {
        //     return renderResponse(ADMIN_LOGIN_PAGE,res, HTTP_BAD_REQUEST, 'Invalid username or password. Please try again.', ALERT_DANGER, '');
        // }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: '1m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: '1d', algorithm: 'HS256' }
        );


        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;

        return renderResponse(ADMIN_LOGIN_PAGE, res, HTTP_SUCCESS, 'Login Successful', ALERT_SUCCESS, ADMIN_DASHBOARD);
    } catch (error) {
        return renderResponse(ADMIN_LOGIN_PAGE,res, HTTP_SERVER_ERROR, 'Internal server error', ALERT_DANGER, '');
    }
}


function createpage(req, res) {
    renderResponse(ADMIN_SIGNUP_PAGE, res, HTTP_SUCCESS, '', '', '');
}

async function createAdmin(req, res) {
    
    try {
        const { firstName, lastName, userEmail, password, userName,phone, confirmPassword } = req.body

        const validationErrors = isAdminSignupFormValid(firstName, lastName, userEmail, password, userName, phone, confirmPassword);

        if (validationErrors) {
            const errorMessage = validationErrors.join(" "); 
            return renderResponse(ADMIN_SIGNUP_PAGE, res, HTTP_BAD_REQUEST, errorMessage, ALERT_DANGER, '');
        }
        const userRole = await Role.findOne({ roleName: 'SuperAdmin' });
        
        const existingUser = await User.findOne({ $or: [{ userName }, { email:userEmail }] });
        
        if (existingUser) {
            return renderResponse(ADMIN_SIGNUP_PAGE, res, HTTP_CONFICT, 'Username or email already exists', ALERT_DANGER, '');
        }

        const user = {
            firstName,
            lastName,
            email:userEmail,
            password,
            userName,
            phone,
            isBlocked: false,
            role: userRole._id
        }

        const newUser = new User(user);
        await newUser.save();
        renderResponse(ADMIN_SIGNUP_PAGE, res, HTTP_SUCCESS, 'User Admin Created', ALERT_SUCCESS, ADMIN_DASHBOARD);
    } catch (error) {
        renderResponse(ADMIN_SIGNUP_PAGE, res, HTTP_SERVER_ERROR, 'Internal Server Error', ALERT_DANGER, '');
    }
}



function renderResponse(pageName,res, status, alertMessage, alertType, redirectUrl) {
    res.status(status).render(pageName, { alertMessage, alertType, redirectUrl });
}

async function adminLogout(req, res) {
    try {
        const token = req.session.accessToken  
        const result = await Token.deleteOne({ access_token: token })

        if (result.deletedCount === 1) {
            try{
                req.session.destroy((err) => {
                    if (err) {
                      console.error('Error destroying session:', err);
                      return  res.status(HTTP_SERVER_ERROR).json({message:"Internal Server Error"})
                    }
                    res.status(HTTP_SUCCESS).json({message:"Logged out successfully"})
                  });
            }catch(error){
                res.status(HTTP_SERVER_ERROR).json({message:"Internal Server Error"})
            }
        } else {
            return res.status(400).json({ message: "Error in Token" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" })
    }

}


export { createpage, createAdmin, loginPage, adminLogin, adminLogout }