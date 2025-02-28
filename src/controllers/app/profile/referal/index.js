import { USER_REFERAL_PAGE } from "../../../../constans/page.js"

async function renderReferalPage (req,res){
    const access_token = req.session.accessToken
    try{
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            res.status(200).render(USER_REFERAL_PAGE,{currentUser})
        }
       

    }catch(error){
        res.status(500).render(USER_REFERAL_PAGE,{currentUser:{}})
    }
}

export{
    renderReferalPage
}