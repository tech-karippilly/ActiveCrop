import express from "express";
import { Whishlist } from "../../models/index.js";
import { USER_WISHLIST } from "../../constans/page.js";
import { ADD_WISHLIST } from "../../constans/endpoints.js";
import { addToWishlist } from "../../controllers/app/whishlist/index.js";
import { protect } from "../../middleware/adminAuthMiddleware.js";

const route = express.Router()



route.get('/', async (req,res)=>{
    try{
        const whishlist = await Whishlist.find()
        console.log("whishlist",whishlist)
        res.status(200).render(USER_WISHLIST,{isLogin:false,cartLength:0,wishlist:{items:[]}})
    }catch(error){
        res.status(500).render(USER_WISHLIST)
    }
    
})

route.get(ADD_WISHLIST,protect, addToWishlist)

export default route