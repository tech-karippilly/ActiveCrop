import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../constans/httpStatus.js";
import { USER_CART_PAGE } from "../../../constans/page.js";
import jwt from 'jsonwebtoken'
import { Categoery, User } from "../../../models/index.js";

async function renderCartPage(req, res) {
    try {
        const catagories = await Categoery.find()
        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            return res.status(HTTP_SUCCESS).render(USER_CART_PAGE, { isLogin: true, catagories, currentUser })
        }
        return res.status(HTTP_SUCCESS).render(USER_CART_PAGE, { isLogin: false, catagories, currentUser:{} })
    } catch (error) {
        return res.status(HTTP_SERVER_ERROR).render(USER_CART_PAGE, { isLogin: false, catagories, currentUser: {} })
    }

}


export {
    renderCartPage
}