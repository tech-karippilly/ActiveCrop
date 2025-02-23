import mongoose from "mongoose";

const cartItemSchema =new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        require:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },

    priceAtPurchanse:{
        type:Number,
        required:true
    },
    product_stock:{
        type: String,
        required: true
    },
    product_image:{
        type:String,
        required:true
    },
    product_name:{
        type:String,
        required:true 
    }
},
{
    timestamps:true
}
)

const cartSchema = new mongoose.Schema({
    total_price:{
        type:Number,
        require:true,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    shipping:{
        type:Number,
        default:100
    },
    items:[cartItemSchema],
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    status:{
        type:String,
        enum:['active','ordered','canceled'],
        default:'active'
    },
},
{
    timestamps:true
})

// cartSchema.pre('save', function (next) {
//     this.total_price = this.items.reduce((acc, item) => acc + item.priceAtPurchanse * item.quantity, 0);
//     next();
// });

export default cartSchema