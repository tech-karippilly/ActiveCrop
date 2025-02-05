import express from 'express'
import { OtpVerifyPage, resendOtp, sendOtp, verifyOtp } from '../../../controllers/auth/otp/index.js'
import { USER_OTP_VERIFY } from '../../../constans/endpoints.js'


const route = express.Router()

route.post('/sendOtp',sendOtp)
route.get(USER_OTP_VERIFY,OtpVerifyPage)
route.post(USER_OTP_VERIFY,verifyOtp)
route.post('/resentOtp',resendOtp)

export default route