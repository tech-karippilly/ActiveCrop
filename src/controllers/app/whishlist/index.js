import { Product, Whishlist } from "../../../models/index.js"

const addToWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Assuming user ID is extracted from auth middlewar
        console.log(req.params)
        // Validate product existence
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }


        let wishlist = await Whishlist.findOne({ user: userId });

        if (!wishlist) {

            wishlist = new Whishlist({ user: userId, itemes: [id] });
        } else {

            if (wishlist.itemes.includes(id)) {
                return res.status(400).json({ message: "Product already in wishlist" });
            }

            wishlist.itemes.push({ catagoery_id:product.catagoery_id, product_name: product.product_name, product_id: productId, quantity: quantity, priceAtPurchanse: product.price, product_image: product.images[0], product_stock: product.stock_quantity, offer_price: product.offer_price });
        }

        await wishlist.save();
        console.log("wishlist",wishlist)

        res.status(200).json({ message: "Product added to wishlist", wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    addToWishlist
}