import mongoose, { Schema } from "mongoose"

const categoerySchema  =mongoose.Schema({
    catagoery_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},
{
timestamp:true
}
)

const categoeryImage = mongoose.Schema({
    filename:{type:String,required:true},
    contentType:{type:String,required:true},
},{
    timestamp:true
})

export {
    categoeryImage,
    categoerySchema
}
