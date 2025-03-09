import mongoose  from'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  transactionDate: { type: Date, required: true, default: Date.now },
  transactionType: { type: String, required: true, enum: ['purchase', 'refund', 'withdrawal', 'deposit'] },
  source: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
}, { timestamps: true });


export default transactionSchema
