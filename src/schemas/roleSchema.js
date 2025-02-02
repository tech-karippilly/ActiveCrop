import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    roleName:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    }
},
{
    timestamps:true
}
)

export default roleSchema