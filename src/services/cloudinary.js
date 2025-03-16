import {v2 as cloudinary} from 'cloudinary'
import { config } from 'dotenv'

config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const uploadImage = async (filePath,folder_name) =>{
    try{
        const result = await cloudinary.uploader.upload(filePath,{
            folder:folder_name
        })
        return result
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
}

const getImageUrl = (publicId) =>{
    return cloudinary.url(publicId,{secure:true})
}

export {
    uploadImage,
    getImageUrl
}