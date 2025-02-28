import mongoose, { Schema } from "mongoose";

const walletSchema = new mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
      },
      balance: {
        type: Number,
        required: true, 
        default: 0, 
      },
    },
    {
      timestamps: true,
    }
  );

  const transactionSchema = new Schema(
    {
      walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ['credit', 'debit'], // 'credit' for adding funds, 'debit' for spending
        required: true,
      },
      description: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
    },
    {
      timestamps: true,
    }
  );

  export{transactionSchema}

export default walletSchema