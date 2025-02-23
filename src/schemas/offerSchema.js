import mongoose, { Schema } from "mongoose";

const ProductOfferSchema = new Schema({
    product: {
        product_name: {
            type: String,
            required: true
        },
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    offer_type: {
        type: String,
        enum: ['percentage', 'flat_discount'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    valid_from: {
        type: Date,
        required: true
    },
    valid_until: {
        type: Date,
        required: true
    },
    min_quantity: {
        type: Number,
        default: 1
    },
    max_discount: {
        type: Number,
        default: 10
    }
});

const categoryOfferSchema = new Schema({
    category: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        category_name: {
            type: String,
            required: true
        }
    },
    offer_type: {
        type: String,
        enum: ['percentage', 'flat_discount'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    valid_from: {
        type: Date,
        required: true
    },
    valid_until: {
        type: Date,
        required: true
    },
    min_quantity: {
        type: Number,
        default: 1
    },
    max_discount: {
        type: Number,
        default: 10
    }
});


export { categoryOfferSchema, ProductOfferSchema };
