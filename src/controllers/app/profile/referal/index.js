import { USER_REFERAL_PAGE } from "../../../../constans/page.js"
import { Referal, ReferalHistory, User } from "../../../../models/index.js"
import { generateUniqueReferralCode } from "../../../../utils/helperfunction.js"
import jwt from 'jsonwebtoken'

async function renderReferalPage(req, res) {
    const access_token = req.session.accessToken
    try {
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const referal = await Referal.findOne({ userId })
            if (!referal) {
                const code = await generateUniqueReferralCode()
                const newReferal = new Referal({
                    userId,

                    referralCode: code
                })
                await newReferal.save()
            }
            const referalDetails = await Referal.findOne({ userId })
            const referralCode = referalDetails.referralCode
            const referralHistory = await ReferalHistory.find({referralCode})
            console.log(referalDetails)
            const referalLink = `${process.env.HOST_URL}/auth/signup?referalCode=${referralCode}`
            res.status(200).render(USER_REFERAL_PAGE, { currentUser,referalDetails ,referralHistory,referalLink})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).render(USER_REFERAL_PAGE, { currentUser: {} })
    }
}



export {
    renderReferalPage
}