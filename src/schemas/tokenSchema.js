import mongoose from "mongoose";

const tokenSchema  = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    access_token:{
        type:String,
        required:true
    },
    refresh_token:{
        type:String,
        required:true
    },

},{
    timestamps:true
})

export default tokenSchema