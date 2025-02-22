import express from "express";
import { Whishlist } from "../../models/index.js";

const route = express.Router()



route.get('/', async (req,res)=>{
    try{
        const whishlist = await Whishlist.find()
        console.log("whishlist",whishlist)
        res.status(200).render('user/whishlist/index',{isLogin:false,cartLength:0,wishlist:{items:[]}})
    }catch(error){
        res.status(500).render('user/whishlist/index')
    }
    
})

export default route