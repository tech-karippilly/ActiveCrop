import mongoose from "mongoose";




async function ConnectDb(){
    try{
        await mongoose.connect(process.env.MONGODB_URL)
    }catch(error){

    }
}


export default ConnectDb