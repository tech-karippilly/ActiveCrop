import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../constans/httpStatus.js";
import { CHECKOUT_PAGE, USER_CART_PAGE } from "../../../constans/page.js";
import jwt from 'jsonwebtoken'
import { Address, Cart, Categoery, Order, Product, User } from "../../../models/index.js";
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

async function renderCartPage(req, res) {
    try {
        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            const cart = await Cart.findOne({ user_id: userId, status: 'active' })
            let cartLength = 0
            if (cart && cart.items) {
                cartLength = cart.items.length;
            }
           
            return res.status(HTTP_SUCCESS).render(USER_CART_PAGE, { isLogin: true, currentUser, cart, cartLength })
        }
        return res.status(HTTP_SUCCESS).render(USER_CART_PAGE, { isLogin: false, currentUser: {}, cart: {}, cartLength: 0 })
    } catch (error) {
        return res.status(HTTP_SERVER_ERROR).render(USER_CART_PAGE, { isLogin: false, currentUser: {}, cart: {}, cartLength: 0 })
    }
}


async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body

        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const user = await User.findById(userId)
            const product = await Product.findById(productId)

            if (!product) {
                return res.status(404).json({ message: "Product not Found" })
            }

            if (quantity > product.stock_quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }

            let cart = await Cart.findOne({ user_id: user._id, status: 'active' });
            if (!cart) {
                cart = new Cart({ user_id: user._id, items: [] });
            }

            const itemIndex = cart.items.findIndex(item =>
                item.product_id.equals(new ObjectId(productId))
            );

            if (itemIndex > -1) {
                const newQuantity = cart.items[itemIndex].quantity + quantity;
                if (newQuantity > product.stockQuantity) {
                    return res.status(400).json({ message: 'Not enough stock available' });
                }
                cart.items[itemIndex].quantity = newQuantity;
            } else {


                cart.items.push({ product_name: product.product_name, product_id: productId, quantity: quantity, priceAtPurchanse: product.price, product_image: product.images[0], product_stock: product.stock_quantity,offer_price:product.offer_price });
            }

            await cart.save();
            res.status(200).json({ message: "Product added to cart", cart });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCart(req, res) {
    try {
        const { productId, quantity } = req.body
        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const user = await User.findById(userId)
            const cart = await Cart.findOne({ user_id: user._id, status: 'active' });
            const product = await Product.findById(productId);
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const item = cart.items.find(item => item.product_id.equals(new ObjectId(productId)));
            if (!item) {
                return res.status(404).json({ message: 'Product not in cart' });
            }

            if (quantity > product.stock_quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            if (quantity <= 0) {

                cart.items = cart.items.filter(item => item.product_id.equals(new ObjectId(productId)));
            } else {
                item.quantity = quantity;
            }
            await cart.save();
            res.status(200).json({ message: 'Quantity Updates', cart });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const removeItem = async (req, res) => {
    try {
        const access_token = req.session.accessToken
        if (access_token) {
            const { id } = req.params;
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const user = await User.findById(userId)
            const cart = await Cart.findOne({ user_id: user._id, status: 'active' });

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const item = cart.items.find(item =>
                item.product_id.equals(new ObjectId(id))
            );

            if (item) {

                cart.items = cart.items.filter(item =>
                    !item.product_id.equals(new ObjectId(id))
                );


                cart.total_price = cart.items.reduce(
                    (acc, curr) => acc + curr.priceAtPurchanse * curr.quantity,
                    0
                );

                await cart.save();
                return res.status(200).json({ message: 'Product Removed', cart });
            }

            res.status(404).json({ message: 'Item not Found' });
        }


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};





export {
    renderCartPage,
    addToCart,
    updateCart,
    removeItem,

}