import { USER_WISHLIST } from "../../../constans/page.js"
import { Cart, Product, Whishlist } from "../../../models/index.js"


const renderWishlist = async (req, res) => {
    try {
        const user = req.user
        const userId = req.user._id
        const wishlist = await Whishlist.findOne({ user: user._id })
        const cart = await Cart.findOne({ user_id: userId, status: 'active' })
        res.status(200).render(USER_WISHLIST, { isLogin: user ? true : false, currentUser: user, cartLength: cart.items.length, wishlist })
    } catch (error) {
        res.status(500).render(USER_WISHLIST)
    }
}

const addToWishlist = async (req, res) => {
    try {
        const { id, quantity } = req.params;
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
                        offer_price: product.offer_price,
                        quantity
                    }
                ]
            });
        } else {
            const itemExists = wishlist.items.some(item => item.product_id.toString() === id);
            if (itemExists) {
                return res.status(200).json({ message: "Product already in wishlist", wishlist: itemExists });
            }

            wishlist.items.push({
                category_id: product.catagoery_id,
                product_name: product.product_name,
                product_id: id,
                priceAtPurchase: product.price,
                product_image: product.images?.[0] || "",
                product_stock: product.stock_quantity,
                offer_price: product.offer_price,
                quantity
            });
        }

        await wishlist.save();
        res.status(200).json({ message: "Product added to wishlist", wishlist });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const moveToCart = async (req, res) => {
    try {
        const { wishlistId, productId } = req.params;
        const userId = req.user._id;


        const wishlist = await Whishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        const wishlistProduct = wishlist.items.find((product) => product.product_id.equals(productId))
        const wishlistProducts = wishlist.items.find((product) => !product.product_id.equals(productId))


        const currentProduct = await Product.findById(productId)
        if (wishlistProduct.quantity > currentProduct.stock_quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }
        let cart = await Cart.findOne({ user_id: userId, status: 'active' });
        if (!cart) {
            cart = new Cart({ user_id: userId, items: [] });
        }
        const itemIndex = cart.items.findIndex(item =>
            item.product_id.equals(new ObjectId(productId))
        );
        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + wishlistProduct.quantity;
            if (newQuantity > currentProduct.stockQuantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }
            cart.items[itemIndex].quantity = newQuantity;
        } else {


            cart.items.push({ catagoery_id: currentProduct.catagoery_id, product_name: currentProduct.product_name, product_id: productId, quantity: wishlistProduct.quantity, priceAtPurchanse: currentProduct.price, product_image: currentProduct.images[0], product_stock: currentProduct.stock_quantity, offer_price: currentProduct.offer_price });
        }
        wishlist.items = wishlistProducts
        await cart.save();
        await wishlist.save();

        res.status(200).json({ message: "Item moved to cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params
        const user = req.user
        const userId = req.user._id
        const wishlist = await Whishlist.findOne({ user: user._id })
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        wishlist.items = wishlist.items.find((product) => !product.product_id.equals(id))
        await wishlist.save();
        return res.json({ success: true, message: "Item removed from wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}




export {
    renderWishlist,
    addToWishlist,
    moveToCart,
    removeFromWishlist
}