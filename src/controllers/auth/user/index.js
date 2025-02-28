import { OTPModel, Role, User } from '../../../models/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { sendresetMail } from '../../../utils/mailSender.js';
import { isResetPasswordValid, isUserLoginFormValid, signUpFormValid } from '../../../utils/formValidations.js';
import { HTTP_BAD_REQUEST, HTTP_CONFICT, HTTP_FORBIDDEN, HTTP_NOT_FOUND, HTTP_SERVER_ERROR, HTTP_SUCCESS } from '../../../constans/httpStatus.js';
import { ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING } from '../../../utils/alert.js';
import { USER_FORGOT_EMAIL_SEND_PAGE, USER_LOGIN_PAGE, USER_REST_EMAIL_PAGE, USER_SIGNUP_PAGE } from '../../../constans/page.js';
import otpGenerator from 'otp-generator';
dotenv.config();

async function getUser(req, res) {
    res.status(200).send('working')
}

function loginPageUser(req, res) {
    res.status(200).render('user/auth/loginPage', { alertMessage: '', alertType: '', redirectUrl: '' })
}

async function loginUser(req, res) {

    try {
        const { userName, password } = req.body

        const isFormValid = isUserLoginFormValid(userName)

        if (isFormValid) {
            const user = await User.findOne({ userName })
            if (!user) {
                return renderPage(res, HTTP_NOT_FOUND, USER_LOGIN_PAGE, 'Users Not Found', ALERT_DANGER, '')
            }
            if (!user.isVerifyed) {
                return renderPage(res, HTTP_FORBIDDEN, USER_LOGIN_PAGE, 'Users Not Verifyed', ALERT_WARNING, '')
            }
            if (user.isBlocked) {
                return renderPage(res, HTTP_FORBIDDEN, USER_LOGIN_PAGE, 'Error While Login Please contact admin', ALERT_DANGER, '')
            }
            const isPasswordValid = await user.comparePassword(password)

            if (!isPasswordValid) {
                return renderPage(res, HTTP_BAD_REQUEST, USER_LOGIN_PAGE, 'Invalid User Name or password', ALERT_WARNING, '')
            }

            const accessToken = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET_ACCESS_TOKEN,
                { expiresIn: '1h' }
            );

            const refreshToken = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET_REFRESH_TOKEN,
                { expiresIn: '1d', algorithm: 'HS256' }
            );

            req.session.accessToken = accessToken;
            req.session.refreshToken = refreshToken;
            return renderPage(res, HTTP_SUCCESS, USER_LOGIN_PAGE, 'Login sucessful', ALERT_SUCCESS, '/')
        }
        renderPage(res, HTTP_BAD_REQUEST, USER_LOGIN_PAGE, 'Invlaid User name or password', ALERT_DANGER, '')
    } catch (error) {
        renderPage(res, HTTP_SERVER_ERROR, USER_LOGIN_PAGE, 'Internal Server Error', ALERT_DANGER, '')
    }
}


async function googleLogin(req, res) {
    try {
        const user = req.user
        
        if (user.isBlocked){
            return renderPage(res, HTTP_FORBIDDEN, USER_LOGIN_PAGE, 'Access Denied Please contact admin', ALERT_DANGER, '/auth/login')
        }

        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: '1d', algorithm: 'HS256' }
        );


        req.session.accessToken = accessToken
        req.session.refreshToke = refreshToken

        if (req.session.accessToken) {
            return renderPage(res, HTTP_SUCCESS, USER_LOGIN_PAGE, 'Login sucessful', ALERT_SUCCESS, '/')
        }
        renderPage(res, HTTP_BAD_REQUEST, USER_LOGIN_PAGE, 'Bad Request', ALERT_SUCCESS, '')
    } catch (error) {
        renderPage(res, HTTP_SERVER_ERROR, USER_LOGIN_PAGE, 'Google Login Error', ALERT_SUCCESS, '')
    }
}


function createUserPage(req, res) {
    renderPage(res, HTTP_SUCCESS, USER_SIGNUP_PAGE, '', '', '')
}

async function createUser(req, res) {
    try {
        const { firstName, lastName, email, password, userName, phone, confirmPassword } = req.body
        const validation = signUpFormValid(firstName, lastName, email, password, userName, phone, confirmPassword);

        if (validation !== true) {
            return renderPage(res, HTTP_BAD_REQUEST, USER_SIGNUP_PAGE, validation, ALERT_WARNING, '')
        }

        const userRole = await Role.findOne({ roleName: 'User' });
        const user = {
            firstName,
            lastName,
            email,
            phone: phone,
            password,
            userName,
            isBlocked: false,
            role: userRole._id
        }
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

        if (existingUser) {
            return renderPage(res, HTTP_CONFICT, USER_SIGNUP_PAGE, 'Username or email already exists', ALERT_DANGER, '')
        }
        const newUser = new User(user);


        let otp = otpGenerator.generate(6, {
            digits: true,              
                upperCaseAlphabets: false,  
                lowerCaseAlphabets: false, 
                specialChars: false 
        });

        let result = OTPModel.findOne({ otp: otp })

        while (result) {
            otp = otpGenerator.generate(6, {
                digits: true,              
                upperCaseAlphabets: false,  
                lowerCaseAlphabets: false, 
                specialChars: false 
            })
            result = await OTPModel.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = new OTPModel(otpPayload);

        await otpBody.save();
        await newUser.save();

        renderPage(res, HTTP_SUCCESS, USER_SIGNUP_PAGE, 'User Created Success fully and OTP send', ALERT_SUCCESS, '/otp/verifyOtp', userName)
    } catch (error) {

        return renderPage(res, HTTP_SERVER_ERROR, USER_SIGNUP_PAGE, 'Internal server error', ALERT_DANGER, '')
    }
}

function forgotEmailSendPage(req, res) {
    renderPage(res, HTTP_SUCCESS, USER_FORGOT_EMAIL_SEND_PAGE, '', '', '')
}

async function forgotEmailSend(req, res) {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return renderPage(res, HTTP_CONFICT, USER_FORGOT_EMAIL_SEND_PAGE, 'User not Found', ALERT_DANGER, '')
        }

        const forgotPasswrodPage = `http://localhost:3000/auth/reset-password?email=${email}`

        sendresetMail(email, forgotPasswrodPage)
        renderPage(res, HTTP_SUCCESS, USER_FORGOT_EMAIL_SEND_PAGE, 'Email send sucessfully', ALERT_SUCCESS, '/auth/login')

    } catch (error) {
        renderPage(res, HTTP_SERVER_ERROR, USER_FORGOT_EMAIL_SEND_PAGE, 'Internal Server Error', ALERT_SUCCESS, '')
    }
}

function forgotPasswordPage(req, res) {
    renderPage(res, HTTP_SUCCESS, USER_REST_EMAIL_PAGE, '', '', '')
}

async function resetPassword(req, res) {

    try {
        const email = req.query.email;
        const { password, confirmPassword } = req.body
        const validation = isResetPasswordValid(password, confirmPassword)


        if (validation !== true) {
            return renderPage(res, HTTP_BAD_REQUEST, USER_REST_EMAIL_PAGE, validation, ALERT_WARNING, '')
        }

        const user = await User.findOne({ email })

        if (!user) {
            return renderPage(res, HTTP_NOT_FOUND, USER_REST_EMAIL_PAGE, 'User not Found', ALERT_DANGER, '')
        }
        
        user.password = password
        await user.save()

        res.status(HTTP_SUCCESS).json({message:"Password Changed",redirect:'/auth/login'})
    } catch (error) {
        renderPage(res,HTTP_SERVER_ERROR,USER_REST_EMAIL_PAGE,'Internal Server Error',ALERT_DANGER,'')
    }
}

const googelAuth = async (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`
    res.redirect(url);
}

const logoutUser = async(req,res)=>{
    try{
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/'); 
            }
           
            res.redirect('/'); 
        });
    }catch(error){
        return res.redirect('/'); 
    }
}


const renderPage = (res, status, pageName, alertMessage, alertType, redirectUrl, userName) => {
    res.status(status).render(pageName, { alertMessage, alertType, redirectUrl, userName })
}



export {
    getUser,
    loginPageUser,
    loginUser,
    createUserPage,
    createUser,
    forgotEmailSendPage,
    forgotEmailSend,
    forgotPasswordPage,
    resetPassword,
    googelAuth,
    googleLogin,
    logoutUser
}