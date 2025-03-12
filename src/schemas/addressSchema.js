import mongoose, { Schema } from "mongoose";

const addressSchema = mongoose.Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    address_line_1:{
        type:String,
        required:true,
    },
    address_line_2:{
        type:String,
        required:false
    },
    phone:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true,
    },
    is_default:{
        type:Boolean,
        default:false
    },
    nickname:{
        type:String,
        required:true,
        unique: true 
    }
})

export default addressSchema