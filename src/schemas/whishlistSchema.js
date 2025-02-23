import mongoose from "mongoose";


const WishlistItemSchema = new mongoose.Schema({
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    product_name: { type: String, required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    priceAtPurchase: { type: Number, required: true },
    product_image: { type: String, required: true },
    product_stock: { type: Number, required: true },
    offer_price: { type: Number }
});

const WhishlistSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    items: [WishlistItemSchema]
})

export default WhishlistSchema