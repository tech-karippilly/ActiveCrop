import mongoose, { Schema } from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionType: { type: String, required: true, enum: ['purchase', 'refund', 'withdrawal', 'deposit','Referal'] },
  type: {
    type: String,
    enum: ['wallet', 'order'],
  },
  walletId: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  transactionMode:{
    type:String,
    enum:['credit','debit']
  },
  source: { type: String,},
  userName: { type: String, },
  amount: { type: Number, required: true, min: 0 },
  description:{type:String,required:false}
}, { timestamps: true });


export default transactionSchema
