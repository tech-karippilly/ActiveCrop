import { CHECKOUT_PAGE, ORDER_SUCCESS_PAGE } from "../../../constans/page.js"
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
        console.log(paymentMethod)
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
                receipt: razorPayOrder.receipt
            };

            const newOrder = new Order(newOrderDetails);
            await newOrder.save();

            cart.status = 'ordered';
            await cart.save();

            const razorPayOptions = {
                key: process.env.KEY_ID,
                amount: Math.round((cart.total_price + 100) * 100),
                currency: "INR",
                description: "Active Corp",
                image: "https://yourdomain.com/logo.png",
                order_id: razorPayOrder.id,
                prefill: {
                    name: user.getFullName(),
                    email: user.email || user.user,
                    contact: user.phone
                },
                redirect: true,

                handler: function (response) {
                    fetch(`http:localhost:3000/orders/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    })
                        .then(res => res.json())
                        .then(data => {

                            if (data.redirect) {
                                window.location.href = data.redirect;
                            } else {
                                alert('Payment verification failed');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Error verifying payment');
                        });
                }
            };
            for (const item of cart.items) {
                const product = await Product.findById(item.product_id)
                if (product.stock_quantity >= item.quantity) {
                    product.stock_quantity -= item.quantity;
                    await product.save();
                }
            }
            cart.status = 'ordered';
            await cart.save();
            return res.status(200).json({message:"Razor Pay Order Created",alertType: 'alert-success',user:user, razorPayOptions})

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
                receipt: generateReceiptNumber()
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
              return  res.status(200).json({ message: 'Order placed successfully', alertType: 'alert-success', redirect: `/orders/order-success/${newOrder._id}` });
            }
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, alertType: 'alert-danger' });
    }
}

async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        const order = await Order.findById(razorpay_order_id)

        if (generatedSignature === razorpay_signature && order) {
            order.paymentStatus = "Paid";
            await order.save();


            res.status(200).json({ message: 'Order placed successfully', alertType: 'alert-success', redirect: `/orders/order-success/${order._id}` });
        } else {
            order.paymentStatus = "Failed";
            await order.save();
            res.status(400).send("Payment Failed");
        }

    } catch (error) {
        console.log(error.message)
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
    OrderCancel,
    verifyPayment
}