import { CHECKOUT_PAGE } from "../../../constans/page.js"
import { Address, Cart, Categoery, Order, Product, User } from "../../../models/index.js"
import jwt from 'jsonwebtoken'
const renderCheckout = async (req, res) => {

    const access_token = req.session.accessToken
    if (access_token) {
        const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
        const userId = jwtDecode.userId
        
        const cart = await Cart.findOne({ user_id: userId, status: 'active' })
        const addressList = await Address.find({ user_id: userId })
        const catagories = await Categoery.find()
        const currentUser = await User.findById(userId)
        let cartLength = 0
        if (cart&& cart.items) { 
            cartLength = cart.items.length;
        }
        return res.status(200).render(CHECKOUT_PAGE, { isLogin: true, catagories, addressList, cart,cartLength,currentUser })
    }
}

async function placeOreder(req, res) {
    try {
        const { addressId, cartId, paymentMethod } = req.body;
        const access_token = req.session.accessToken;

        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN);
            const userId = jwtDecode.userId;
            const user = await User.findById(userId);
            const cart = await Cart.findById(cartId) 
            const address = await Address.findById(addressId);

            const newOrderDetails = {
                user: user._id,
                items: cart.items,
                shippingAddress: {
                    fullName: user.getFullName(),
                    address_1: address.address_line_1,
                    address_2: address.address_line_2,
                    city: address.city,
                    postalCode: address.pincode,
                    landmark: address.landmark,
                    country: 'India'
                },
                paymentMethod,
                paymentStatus: 'Paid',
                totalAmount: cart.total_price
            };



            // Reduce stock quantity
            for (const item of cart.items) {
                const product = await Product.findById(item.product_id)
                if (product.stock_quantity >= item.quantity) {
                    product.stock_quantity -= item.quantity;
                    await product.save();
                }
            }

            cart.status = 'ordered';
            await cart.save();

            const newOrder = new Order(newOrderDetails);
            await newOrder.save();

            res.status(200).json({ message: 'Order placed successfully', alertType: 'alert-success', redirect: '/' });
        } else {
            res.status(401).json({ message: 'Unauthorized', alertType: 'alert-danger' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', alertType: 'alert-info' });
    }
}

export {
    renderCheckout,
    placeOreder
}