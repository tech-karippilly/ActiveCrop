import mongoose, { Schema } from "mongoose"

const productSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock_quantity: {
        type: String,
        required: true
    },
    catagoery_id: {
        type: Schema.Types.ObjectId,
        ref: 'categoeries',
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    offer_price:{
        type:String,
        default:0
    }
},
{
    timestamps: true
}
)

export default productSchema