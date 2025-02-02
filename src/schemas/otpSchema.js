import mongoose from "mongoose";
import mailSender, { sendVerificationEmail } from '../utils/mailSender.js'

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        requires:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createAt:{
        type:Date,
        default:Date.now,
        expires:60*5
    }
},{
    timestamps:true
})



  otpSchema.pre("save", async function (next) {
    // Only send an email when a new document is created
    if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
    }
    next();
  });

  export default otpSchema