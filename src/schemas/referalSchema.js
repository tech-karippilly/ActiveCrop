import mongoose, { Schema } from "mongoose";

const referralHistorySchema = new mongoose.Schema({
    referralCode: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    userAmount: {
        type: Number,
        default: 0
    },
    referalAmount: {
        type: Number,
        default: 0
    }
})

const referralSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        index: true
    }
}, {
    timestamps: true
});

export { referralHistorySchema }

export default referralSchema