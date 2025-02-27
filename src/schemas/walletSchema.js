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


export default walletSchema