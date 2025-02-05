import { OTPModel, User } from "../../../models/index.js"
import otpGenerator from 'otp-generator'
import moment from "moment/moment.js"
import { HTTP_SUCCESS } from "../../../constans/httpStatus.js"
import { USER_OTP_VERIFY_PAGE } from "../../../constans/page.js"
import jwt from 'jsonwebtoken'


async function sendOtp(req, res) {
    try {
        const { userName } = req.body

        const checkUser = await User.findOne({ userName })

        if (!checkUser) {
            return res.status(401).json({message:'User Not Found',status:401})
        }

    
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
        const email = checkUser.email
        const otpPayload = { email, otp };
        const otpBody = new OTPModel(otpPayload);

        await otpBody.save();
        res.status(200).redirect('/api/otp/verifyOtp',{alertMessage,alertType})
       
    } catch (error) {
        res.status(500).json({message:'Internal server Error',status:500})
    }
}

async function resendOtp(req, res) {

    try {
        
        const { userName } = req.body

        const checkUser = await User.findOne({ userName })

        if (!checkUser) {
            return res.status(401).send('User Not Found')
        }

        let otp = otpGenerator.generate(6, {
            digits: true,              
            upperCaseAlphabets: false,  
            lowerCaseAlphabets: false,  
            specialChars: false       
        });

        let result = OTPModel.findOne({ otp: otp })
        while (result) {
            let otp = otpGenerator.generate(6, {
                digits: true,              
                upperCaseAlphabets: false,  
                lowerCaseAlphabets: false, 
                specialChars: false        
            });
            result = await OTPModel.findOne({ otp: otp });
        }
        const email =checkUser.email
        const otpPayload = { email, otp };
        const otpBody = new OTPModel(otpPayload);

        await otpBody.save();
        res.status(200).json({
            message: 'OTP sent successfully',
            otp,
        });

    } catch (error) {
        res.status(500).send('Internal server Error')
    }
}

function OtpVerifyPage(req,res){
    res.status(HTTP_SUCCESS).render(USER_OTP_VERIFY_PAGE,{alertMessage:'',alertType:'',redirectUrl:''})
}

async function verifyOtp(req, res) {
    try {
        const { OtpVerify } = req.body
        const getOtp = await OTPModel.findOne({ otp:OtpVerify })
        
        if(!getOtp){
            return res.status(404).render('user/auth/otpVerify',{ alertMessage: 'OTP record not found', alertType: 'Danger', redirectUrl: '' })
        }

        const otpExpires = 5
        const createdAt = moment(getOtp.createdAt);
        const currentTime = moment();
        const expiryTime = createdAt.add(otpExpires, 'minutes');

        if (currentTime.isAfter(expiryTime)) {
            return res.status(400).render('user/auth/otpVerify',{ alertMessage: 'In valid OTP', alertType: 'Danger', redirectUrl: '' })
        }
        const user  = await User.findOne({email:getOtp.email})

        user.isVerifyed =true

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
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;

        await  user.save()

        return res.status(200).render('user/auth/otpVerify',{ alertMessage: 'OTP verified successfully', alertType: 'success', redirectUrl: '/' })
    } catch (error) {
        res.status(500).render('user/auth/otpVerify',{ alertMessage: 'Internal Server Error', alertType: 'Danger', redirectUrl: '' })
    }
}

export {
    sendOtp,
    resendOtp,
    OtpVerifyPage,
    verifyOtp
}