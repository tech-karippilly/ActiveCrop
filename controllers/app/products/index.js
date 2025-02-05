import { HTTP_SUCCESS } from "../../../constans/httpStatus.js"
import { USER_PRODUCT_DETAILS_PAGE, USER_PRODUCT_PAGE } from "../../../constans/page.js"
import { Categoery, Product, Review, User } from "../../../models/index.js"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

async function productsPage(req,res) {
    try{
        const {id} = req.params
        const products = await Product.find({catagoery_id:id})
        const catagories = await Categoery.find()
        const access_token = req.session.accessToken
        if (access_token){
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
        return res.status(HTTP_SUCCESS).render(USER_PRODUCT_PAGE,{isLogin:true,products,catagories,activeCata:id,currentUser})
        }

        res.status(HTTP_SUCCESS).render(USER_PRODUCT_PAGE,{isLogin:false,products,catagories,activeCata:id,currentUser:{}})
    }catch(error){

    }
}

async function productDetailsPage(req,res){
    try{
        const {id,cataid} = req.params
        const products = await Product.findById({_id:id})
        const catagories = await Categoery.find()
        const reviews = await Review.find({ 'product.productId': id })
        const activeCata = await Categoery.findById(cataid)
        const access_token = req.session.accessToken
        if (access_token){
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
           return res.status(HTTP_SUCCESS).render(USER_PRODUCT_DETAILS_PAGE,{
            isLogin:true,
            products,
            catagories,
            activeCata:cataid,
            activeCataName: activeCata ? activeCata.catagoery_name : "Category",
            reviews,
            currentUser
        })
        }

      return  res.status(HTTP_SUCCESS).render(USER_PRODUCT_DETAILS_PAGE,{
        isLogin:false,
        products,
        catagories,
        activeCata:cataid,
        activeCataName: activeCata ? activeCata.catagoery_name : "Category",
        reviews,
        currentUser:{}
    })
    }catch(error){

    }
}



export {
    productsPage,
    productDetailsPage
}