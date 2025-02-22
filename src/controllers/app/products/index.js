import { HTTP_SUCCESS } from "../../../constans/httpStatus.js"
import { USER_PRODUCT_DETAILS_PAGE, USER_PRODUCT_PAGE } from "../../../constans/page.js"
import { Cart, Categoery, Product, productOffer, Review, User } from "../../../models/index.js"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { applyOffers } from "../../../utils/helperfunction.js"

async function productsPage(req, res) {
    try {
        const { id } = req.params
        const products = await Product.find({ catagoery_id: id })
        const getOffers = await productOffer.find()
        const catagories = await Categoery.find()
        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const cart = await Cart.find({user_id:userId ,status:'active'})
            
            let cartLength = 0
            if (cart.length > 0 && cart[0].items) { 
                cartLength = cart[0].items.length;
            }
            
            const newProductList = applyOffers(products,getOffers)
            return res.status(HTTP_SUCCESS).render(USER_PRODUCT_PAGE, { isLogin: true, products:newProductList, catagories, activeCata: id, currentUser,cartLength })
        }
       
        const newProductList = applyOffers(products,getOffers)
        res.status(HTTP_SUCCESS).render(USER_PRODUCT_PAGE, { isLogin: false, products:newProductList, catagories, activeCata: id, currentUser: {} ,cartLength:0})
    } catch (error) {
        res.status(HTTP_SUCCESS).render(USER_PRODUCT_PAGE, { isLogin: false, products: [], catagories: [], activeCata: '', currentUser: {} ,cartLength:0})
    }
}

async function filterProducts(req, res) {
    try {
        const {catagoery}  = req.params
        const {sort} = req.query
        if (sort === 'price-high-low' || sort === 'price-low-high' ) {
            const rule = sort === 'price-low-high' ? -1 : 1
            const products = await Product.find({catagoery_id:catagoery}).sort({ price: rule })
            return res.status(200).json({message:'success',products})
        }else if (sort==='az' || sort==='za'){
            const rule = sort === 'az' ? 1 : -1
            const products = await Product.find({catagoery_id:catagoery}).sort({ product_name: rule })
            return res.status(200).json({message:'success',products})
        }else if (sort==='new-arrivals'){
            const products = await Product.find({catagoery_id:catagoery}).sort({ createdAt: 1 }).limit(1)
            return res.status(200).json({message:'success',products})
        }else{
            const products = await Product.find()
            return res.status(200).json({message:'success',products})
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

async function productDetailsPage(req, res) {
    try {
        const { id, cataid } = req.params
        const products = await Product.findById({ _id: id })
        const catagories = await Categoery.find()
        const reviews = await Review.find({ 'product.productId': id })
        const activeCata = await Categoery.findById(cataid)
        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const cart = await Cart.findOne({user_id:userId ,status:'active'})
            let cartLength = 0
            if (cart> 0 && cart.items) { 
                cartLength = cart.items.length;
            }
            return res.status(HTTP_SUCCESS).render(USER_PRODUCT_DETAILS_PAGE, {
                isLogin: true,
                products,
                catagories,
                activeCata: cataid,
                activeCataName: activeCata ? activeCata.catagoery_name : "Category",
                reviews,
                currentUser,
                cartLength
            })
        }
        return res.status(HTTP_SUCCESS).render(USER_PRODUCT_DETAILS_PAGE, {
            isLogin: false,
            products,
            catagories,
            activeCata: cataid,
            activeCataName: activeCata ? activeCata.catagoery_name : "Category",
            reviews,
            currentUser: {}
        })
    } catch (error) {

    }
}



export {
    productsPage,
    filterProducts,
    productDetailsPage
}