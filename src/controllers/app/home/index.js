import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../constans/httpStatus.js"
import { USER_HOME_PAGE } from "../../../constans/page.js"
import { Cart, Categoery, User } from "../../../models/index.js"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


const renderHomepage = async (req, res) => {
    try {
        const catagories = await Categoery.find()
        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const cart = await Cart.find({ user_id: userId, status: 'active' })
            let cartLength = 0
            if (cart && cart.items) {
                 cartLength = cart.items.length;
            }
            return res.status(HTTP_SUCCESS).render(USER_HOME_PAGE, { isLogin: true, catagories, currentUser, cartLength })
        }
        return res.status(HTTP_SUCCESS).render(USER_HOME_PAGE, { isLogin: false, catagories, currentUser: {} })
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).render(USER_HOME_PAGE, { isLogin: false, catagories: [], currentUser: {} })
    }
}


export {
    renderHomepage,
}