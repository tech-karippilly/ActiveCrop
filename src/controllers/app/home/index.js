import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../constans/httpStatus.js"
import { USER_HOME_PAGE } from "../../../constans/page.js"
import { Cart, Categoery, Product, User } from "../../../models/index.js"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


const renderHomepage = async (req, res) => {
    try {
        const catagories = await Categoery.find()
        const access_token = req.session.accessToken
        const topProducts = await Product.aggregate([
            {
              $match: {
                status:'Available',isBlocked:false
              }
            },
            {
              $sort:{sales_count:-1}
            },
            {
              $limit: 10
            },
            
          ])
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const cart = await Cart.find({ user_id: userId, status: 'active' })
            let cartLength = 0
            if (cart.length > 0 && cart[0].items) { 
                cartLength = cart[0].items.length;
            }

            

            return res.status(HTTP_SUCCESS).render(USER_HOME_PAGE, { isLogin: true, catagories,topProducts, currentUser, cartLength })
        }



        return res.status(HTTP_SUCCESS).render(USER_HOME_PAGE, { isLogin: false, catagories,topProducts, currentUser: {} })
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).render(USER_HOME_PAGE, { isLogin: false, catagories: [], currentUser: {} })
    }
}

const catagoerySearch = async (req,res)=>{
    try {
        const { query } = req.query;
        const categories = await Categoery.find({
            catagoery_name: { $regex: query, $options: 'i' }
        });
        const access_token = req.session.accessToken

        const topProducts = await Product.aggregate([
            {
              $match: {
                status:'Available',isBlocked:false
              }
            },
            {
              $sort:{sales_count:-1}
            },
            {
              $limit: 10
            },
            
          ])
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const cart = await Cart.find({ user_id: userId, status: 'active' })
            let cartLength = 0
            if (cart.length > 0 && cart[0].items) { 
                cartLength = cart[0].items.length;
            }

            return res.status(HTTP_SUCCESS).render(USER_HOME_PAGE, { isLogin: true, catagories:categories, currentUser, cartLength ,topProducts})
        }else{
            return res.status(HTTP_SUCCESS).render(USER_HOME_PAGE, { isLogin: false, catagories:categories, currentUser:{},topProducts, cartLength:0 })
        }

    } catch (err) {
        res.status(500).json({ err: 'Server Error' });
    }
}


export {
    renderHomepage,
    catagoerySearch
}