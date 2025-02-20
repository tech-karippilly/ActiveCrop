import mongoose from "mongoose"

const ReferalofferSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    descriptio:{
        type:String,
        required: true
    },
    rewardAmount:{
        type:String,
        required: true
    },
    active:{
        type:Boolean,
        default: true
    }
})

export default ReferalofferSchema