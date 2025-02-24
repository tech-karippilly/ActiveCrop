import { USER_WISHLIST } from "../../../constans/page.js"
import { Cart, Product, Whishlist } from "../../../models/index.js"


const renderWishlist = async (req, res) => {
    try {
        const user = req.user
        const whishlist = await Whishlist.find()
        const cart = await Cart.find()
        console.log("whishlist", whishlist)
        res.status(200).render(USER_WISHLIST, { isLogin: user ? true : false, currentUser: user, cartLength: cart.length, whishlist })
    } catch (error) {
        console.log(error.message)
        res.status(500).render(USER_WISHLIST)
    }
}

const addToWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!product.catagoery_id) {
            return res.status(400).json({ message: "Product does not have a category_id" });
        }

        let wishlist = await Whishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Whishlist({
                user: userId, 
                items: [
                    { 
                        category_id: product.catagoery_id, 
                        product_name: product.product_name, 
                        product_id: id, 
                        priceAtPurchase: product.price, 
                        product_image: product.images?.[0] || "", 
                        product_stock: product.stock_quantity, 
                        offer_price: product.offer_price 
                    }
                ]
            });
        } else {
            const itemExists = wishlist.items.some(item => item.product_id.toString() === id);
            if (itemExists) {
                return res.status(200).json({ message: "Product already in wishlist",wishlist:itemExists });
            }

            wishlist.items.push({ 
                category_id: product.catagoery_id, 
                product_name: product.product_name, 
                product_id: id, 
                priceAtPurchase: product.price, 
                product_image: product.images?.[0] || "", 
                product_stock: product.stock_quantity, 
                offer_price: product.offer_price 
            });
        }

        await wishlist.save();
        res.status(200).json({ message: "Product added to wishlist", wishlist });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




export {
    renderWishlist,
    addToWishlist
}