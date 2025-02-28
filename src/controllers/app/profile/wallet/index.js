import jwt from 'jsonwebtoken'
import { USER_WALLET_PAGE } from "../../../../constans/page.js";
import { Transactions, User, Wallet } from '../../../../models/index.js';
import { generateReceiptNumber } from '../../../../utils/helperfunction.js';
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRETE
})

async function renderWalletPage(req, res) {
    const access_token = req.session.accessToken
    try {
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const wallet = await Wallet.findOne({ userId })
            const transactions = await Transactions.find()
            if (!wallet) {
                const newWallet = {
                    userId: userId
                }
                const wallets = new Wallet(newWallet)
                await wallets.save()
            }

            return res.status(200).render(USER_WALLET_PAGE, { currentUser, wallet, transactions })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).render(USER_WALLET_PAGE, { currentUser: {}, wallet: {} })
    }
}




async function addtoWallet(req, res) {
    const access_token = req.session.accessToken
    try {
        const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
        const userId = jwtDecode.userId
        const currentUser = await User.findById(userId)

        const { amount } = req.body
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: generateReceiptNumber(),
            payment_capture: 1
        };
        const walletOrder = await razorpay.orders.create(options)

        const optionsRazorPay = {
            key: process.env.KEY_ID,
            amount: options.amount,
            currency: "INR",
            description: "Active Corp",
            user: {
                name: currentUser.getFullName(),
                email: currentUser.email || currentUser.user,
                contact: currentUser.phone
            },
            order_id: walletOrder.id,
            redirect: true,
        }

        res.status(200).json({ message: 'success', walletOrder ,optionsRazorPay })
    } catch (error) { }
}


export {
    renderWalletPage
}