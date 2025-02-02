import mongoose, { Schema } from "mongoose"
import productSchema from "./productShcema.js"
import userSchema from "./userSchema.js"

const reviewSchema = new Schema({
    product:{type:productSchema,required:true},
    user:{type:userSchema,required:true},
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    reviewText:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default reviewSchema