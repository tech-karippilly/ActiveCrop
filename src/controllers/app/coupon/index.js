import { Cart, Coupons } from "../../../models/index.js"


async function getCoupons(req, res) {
    try {
        const coupons = await Coupons.find()
        res.status(200).json({ message: 'success', coupons })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

async function applyCoupons(req, res) {
    try {
        const { coupon } = req.params
        const { cartId } = req.query

        console.log(coupon)
        console.log(cartId)
        const existingCoupon = await Coupons.findOne({ code: coupon })

        if (!existingCoupon) {
            return res.status(404).json({ message: 'Coupon does not exists' })
        }

        const cart = await Cart.findById(cartId)
        console.log(cart)

        if (cart.total_price < existingCoupon.minPurchaseAmount) {
            return res.status(400).json({ message: `not satisfied to apply coupon need ${Number(existingCoupon.minPurchaseAmount) - Number(cart.total_price)} to apply coupon`, })
        }

        cart.discount += existingCoupon.discountValue
        cart.discount += existingCoupon.discountValue
        cart.total_price -= existingCoupon.discountValue

        await cart.save()
        res.status(200).json({ message: 'Coupon Applied ' })


    } catch (error) {
        res.status(500).json({ message: 'Internal server Error', error: error.message })
    }
}

export {
    getCoupons,
    applyCoupons
}