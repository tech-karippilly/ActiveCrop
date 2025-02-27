import mongoose from "mongoose";
import roleSchema from "../schemas/roleSchema.js";
import userSchema from "../schemas/userSchema.js";
import otpSchema from "../schemas/otpSchema.js";
import tokenSchema from "../schemas/tokenSchema.js";
import { categoerySchema } from "../schemas/categoerySchema.js";
import productSchema from "../schemas/productShcema.js";
import reviewSchema from "../schemas/reviewSchema.js";
import addressSchema from "../schemas/addressSchema.js";
import cartSchema from "../schemas/cartSchema.js";
import orderSchema from "../schemas/orderSchema.js";
import { categoryOfferSchema, ProductOfferSchema } from "../schemas/offerSchema.js";
import ReferalofferSchema from "../schemas/referalOfferSchema.js";
import WhishlistSchema from "../schemas/whishlistSchema.js";
import CouponSchema from "../schemas/CouponSchema.js";
import walletSchema, { transactionSchema } from "../schemas/walletSchema.js";

const Role = mongoose.model('Role',roleSchema)
const User = mongoose.model('Users',userSchema)
const OTPModel = mongoose.model("Otp",otpSchema)
const Token =mongoose.model('Token',tokenSchema)
const Categoery = mongoose.model('Categoery',categoerySchema)
const Product =  mongoose.model('Products',productSchema)
const Review = mongoose.model('Reviews',reviewSchema)
const Address = mongoose.model('Address',addressSchema)
const Cart = mongoose.model('Cart',cartSchema)
const Order = mongoose.model('Order',orderSchema)
const ProductOffer = mongoose.model("ProductOffer",ProductOfferSchema)
const CategoryOffer = mongoose.model('CatagoeryOffer',categoryOfferSchema)
const ReferralOffer = mongoose.model("ReferralOffer", ReferalofferSchema);
const Whishlist = mongoose.model("Whishlist",WhishlistSchema)
const Coupons = mongoose.model("Coupons",CouponSchema)
const Wallet = mongoose.model("Wallet",walletSchema)
const Transactions = mongoose.model("Transactions",transactionSchema)
export {
    Role,
    User,
    OTPModel,
    Token,
    Categoery,
    Product,
    Review,
    Address,
    Cart,
    Order,
    ProductOffer,
    CategoryOffer,
    ReferralOffer,
    Whishlist,
    Coupons,
    Wallet,
    Transactions
}