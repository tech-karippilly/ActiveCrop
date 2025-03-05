import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber:{
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
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
    }
  ],
  discount:{
    type:Number,
    default:true
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    address_1: { type: String, required: true },
    address_2: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    landmark:{ type: String, required: true },
    phone:{type: String, required: true},
    state:{type: String, required: true}
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal', 'cod','razorpay']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelation Requested','Cancelled', 'Retrun Order Processing','Returned'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  orderRetrun:{
    type:String,
    enum:['Pending','Processing', 'Approved','Rejected'],
    default:'Pending'
  },
  orderReturnReason:{
    type:String,
    required:false
  },
  deliveredAt: {
    type: Date
  },
  receipt:{
    type:String,
    default:'',
    trim:true
  },
  appliedCoupon:{
    type:String,
  }
}, {
  timestamps: true
});

export default orderSchema