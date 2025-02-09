import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../constans/httpStatus.js";
import { USER_CART_PAGE } from "../../../constans/page.js";
import jwt from 'jsonwebtoken'
import { Cart, Categoery, Product, User } from "../../../models/index.js";
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

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
        return res.status(HTTP_SUCCESS).render(USER_CART_PAGE, { isLogin: false, catagories, currentUser: {} })
    } catch (error) {
        return res.status(HTTP_SERVER_ERROR).render(USER_CART_PAGE, { isLogin: false, catagories, currentUser: {} })
    }

}


async function getCart(req, res) {
    try {
        const cart = await Cart.findOne({})
    } catch (error) {

    }
}

async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body
        const product = await Product.findById(productId)
        const user = await User.findById('67930bdbd933b5aa5b33d335')

        if (!product) {
            return res.status(404).json({ message: "Product not Found" })
        }

        if (quantity > product.stock_quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        let cart = await Cart.findOne({ user_id: user._id });
        if (!cart) {
            cart = new Cart({ user_id:user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product_id.equals(new ObjectId(productId))
        );
        console.log(itemIndex)
        console.log( cart.items)

        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            if (newQuantity > product.stockQuantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            cart.items[itemIndex].quantity = newQuantity;
        } else {
            cart.items.push({ product_id:productId, quantity:quantity, priceAtPurchanse: product.price });
        }
        
        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCart(req,res){
    try{
        const { productId, quantity } = req.body
        const user = await User.findById('67930bdbd933b5aa5b33d335')
        const cart = await Cart.findOne({ user_id: user._id});
        const product = await Product.findById(productId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
          if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }

          const item = cart.items.find(item => item.productId.toString() === productId);
          if (!item) {
            return res.status(404).json({ message: 'Product not in cart' });
          }

          if (quantity > product.stock_quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
          } else {
            item.quantity = quantity;
          }
          await cart.save();
          res.status(200).json({message:'quantity Updates',cart});
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export {
    renderCartPage,
    getCart,
    addToCart,
    updateCart
}