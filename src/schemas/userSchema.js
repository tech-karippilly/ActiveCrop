import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique: true 
    },
    email:{
        type:String,
        required:true,
        unique: true 
    },
    googleId:{type:String,required:false},
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isVerifyed:{type:Boolean,default:false},
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    profileImage:{type:String,required:false}
})

userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  };

userSchema.methods.hashPassword = async function (plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  };

  userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await this.hashPassword(this.password);
    }
    next();
  });

export default userSchema