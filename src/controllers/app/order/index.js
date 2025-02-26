import { CHECKOUT_PAGE, ORDER_FAILD_PAGE, ORDER_SUCCESS_PAGE } from "../../../constans/page.js"
import { Address, Cart, Categoery, Order, Product, User } from "../../../models/index.js"
import jwt from 'jsonwebtoken'
import { generateOrderNumber } from "../../../utils/order.js"
import { config } from "dotenv"
import Razorpay from 'razorpay'
import { generateReceiptNumber } from "../../../utils/helperfunction.js"
import crypto from 'crypto'
config()

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRETE
})

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
        if (cart && cart.items) {
            cartLength = cart.items.length;
        }
        return res.status(200).render(CHECKOUT_PAGE, { isLogin: true, catagories, addressList, cart, cartLength, currentUser })
    }
}

async function placeOreder(req, res) {
    try {

        const { addressId, cartId, paymentMethod } = req.body;
        const access_token = req.session.accessToken
        const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
        const userId = jwtDecode.userId;
        const user = await User.findById(userId);
        const cart = await Cart.findById(cartId);
        const address = await Address.findById(addressId);
        if (paymentMethod === 'razorpay') {
            const options = {
                amount: (cart.total_price + 100),
                currency: 'INR',
                receipt: generateReceiptNumber(),
            };

            const razorPayOrder = await razorpay.orders.create(options)

            const newOrderDetails = {
                orderNumber: razorPayOrder.id,
                user: user._id,
                items: cart.items,
                shippingAddress: {
                    fullName: user.getFullName(),
                    address_1: address.address_line_1,
                    address_2: address.address_line_2,
                    city: address.city,
                    postalCode: address.pincode,
                    landmark: address.landmark,
                    country: 'India',
                    phone: address.phone,
                    state: address.state
                },
                paymentMethod,
                paymentStatus: 'Pending',
                totalAmount: cart.total_price,
                receipt: razorPayOrder.receipt,
                discount: cart.discount,
                appliedCoupon: cart.appliedCoupon
            };

            const newOrder = new Order(newOrderDetails);
            await newOrder.save();

            cart.status = 'ordered';
            await cart.save();

            const optionsRazorPay = {
                key: process.env.KEY_ID,
                amount: cart.total_price,
                currency: "INR",
                description: "Active Corp",
                user: {
                    name: user.getFullName(),
                    email: user.email || user.user,
                    contact: user.phone
                },
                order_id: razorPayOrder.id,
                redirect: `http://localhost:3000/orders/order-success/${razorPayOrder.id}`,
                redirect: true,
            }

            for (const item of cart.items) {
                const product = await Product.findById(item.product_id)
                if (product.stock_quantity >= item.quantity) {
                    product.stock_quantity -= item.quantity;
                    await product.save();
                }
            }
            cart.status = 'ordered';
            await cart.save();
            return res.status(200).json({ message: "Razor Pay Order Created", alertType: 'alert-success', optionsRazorPay })

        } else if (paymentMethod === 'cod') {
            const newOrderDetails = {
                orderNumber: generateOrderNumber(),
                user: user._id,
                items: cart.items,
                shippingAddress: {
                    fullName: user.getFullName(),
                    address_1: address.address_line_1,
                    address_2: address.address_line_2,
                    city: address.city,
                    postalCode: address.pincode,
                    landmark: address.landmark,
                    country: 'India',
                    phone: address.phone,
                    state: address.state
                },
                paymentMethod,
                paymentStatus: 'Pending',
                totalAmount: cart.total_price,
                receipt: generateReceiptNumber(),
                discount: cart.discount,
                appliedCoupon: cart.appliedCoupon
            };
            for (const item of cart.items) {
                const product = await Product.findById(item.product_id)
                if (product.stock_quantity >= item.quantity) {
                    product.stock_quantity -= item.quantity;
                    await product.save();
                }
                cart.status = 'ordered';
                await cart.save();
                const newOrder = new Order(newOrderDetails);
                await newOrder.save();
                return res.status(200).json({ message: 'Order placed successfully', alertType: 'alert-success', redirect: `/orders/order-success/${newOrder._id}` });
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message, alertType: 'alert-danger' });
    }
}

async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

        if (order_id) {
            const order = await Order.findOne({ orderNumber: order_id })
            order.paymentStatus = 'Failed'
            order.deliveryStatus = 'Cancelled'
            await order.save()
            return res.status(400).json({ message: 'Order failed', alertType: 'alert-danger', redirect: `/orders/order-failed/${order._id}` });
        }

        const hmac = crypto.createHmac("sha256", process.env.KEY_SECRETE);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        const order = await Order.findOne({ orderNumber: razorpay_order_id })

        if (!order) {
            return res.status(404).json({ message: 'order to found' })
        }

        if (generatedSignature === razorpay_signature) {
            order.paymentStatus = "Paid";
            order.deliveryStatus = 'Pending'
            await order.save();
            return res.status(200).json({ message: 'Order placed successfully', alertType: 'alert-success', redirect: `/orders/order-success/${order._id}` });
        } else {
            order.paymentStatus = 'Failed'
            order.deliveryStatus = 'Cancelled'
            await order.save();
            return res.status(400).json({ message: 'Order Failed', alertType: 'alert-danger', redirect: `/orders/order-failed/${order._id}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

async function OrderSuccess(req, res) {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        return res.status(200).render(ORDER_SUCCESS_PAGE, { orderDetails: order })
    } catch (error) {
        return res.status(500).render(ORDER_SUCCESS_PAGE, { orderDetails: {} })
    }
}

async function OrderFailed(req, res) {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        return res.status(200).render(ORDER_FAILD_PAGE, { orderDetails: order })
    } catch (error) {
        return res.status(500).render(ORDER_FAILD_PAGE, { orderDetails: {} })
    }
}

async function OrderCancel(req, res) {
    try {
        const { id } = req.params
        const order = await Order.findById(id)

        order.deliveryStatus = 'Cancelled';


        for (const item of order.items) {
            const product = await Product.findById(item.product_id);
            if (product) {
                product.stock_quantity = Number(product.stock_quantity) + Number(item.quantity);
                await product.save();
            }
        }

        await order.save()
        res.status(200).json({ message: "Order Cancled", alertType: 'alert-success' })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error ", alertType: 'alert-danger' })
    }
}

export {
    renderCheckout,
    placeOreder,
    OrderSuccess,
    OrderFailed,
    OrderCancel,
    verifyPayment
}