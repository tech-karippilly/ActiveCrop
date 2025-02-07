import { HTTP_SERVER_ERROR } from "../../../../constans/httpStatus.js"
import { USER_PASSWORD_REST_PAGE } from "../../../../constans/page.js"
import { User } from "../../../../models/index.js"

async function resetPasswordPage (req,res){
    res.status(200).render(USER_PASSWORD_REST_PAGE)
}

async function resetPassword(req,res){
    try{
        const {password} = req.body
        const currentUser = await User.findById('67930bdbd933b5aa5b33d335')

        if (currentUser){
            currentUser.password = password
            currentUser.save()
            return res.status(200).json({message:"Password Reset Successfully" ,alertType:"alert-success",redirect:'/user/profile'})
        }
        return res.status(404).json({message:"User Not Found" ,alertType:"alert-danger"})
    }catch(error){
        res.status(HTTP_SERVER_ERROR).json({message:'Internal Server Error',alertType:'alert-danger'})
    }
}

export {resetPasswordPage,resetPassword}