import mongoose, { Schema } from "mongoose";


const referalSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referalCode: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

export default referalSchema