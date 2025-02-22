import mongoose from "mongoose";

const WhishlistSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    itemes:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}]
})

export default WhishlistSchema