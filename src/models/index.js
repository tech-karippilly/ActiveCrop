import mongoose from "mongoose";
import roleSchema from "../schemas/roleSchema.js";
import userSchema from "../schemas/userSchema.js";
import otpSchema from "../schemas/otpSchema.js";
import tokenSchema from "../schemas/tokenSchema.js";
import { categoerySchema } from "../schemas/categoerySchema.js";
import productSchema from "../schemas/productShcema.js";
import reviewSchema from "../schemas/reviewSchema.js";

const Role = mongoose.model('Role',roleSchema)
const User = mongoose.model('Users',userSchema)
const OTPModel = mongoose.model("Otp",otpSchema)
const Token =mongoose.model('Token',tokenSchema)
const Categoery = mongoose.model('Categoery',categoerySchema)
const Product =  mongoose.model('Products',productSchema)
const Review = mongoose.model('Reviews',reviewSchema)
export {
    Role,
    User,
    OTPModel,
    Token,
    Categoery,
    Product,
    Review
}