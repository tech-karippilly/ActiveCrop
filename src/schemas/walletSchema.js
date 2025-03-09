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
      paymenType: {
        type: String,
        enum: ['credit', 'debit'], 
        required: true,
      },
      description: {
        type: String,
      },
      transactionType:{
        type:String,
        enum:['wallet','order'],
        required: true,
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