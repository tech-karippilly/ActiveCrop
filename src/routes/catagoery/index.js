import express from "express";
import { createCatagoeryPage, createCategoery, deletCategoery, getCategoery, searchCategoery, updateCatagoeryPage, updateCategoery } from "../../controllers/categoery/index.js";
import multer from 'multer'
import fs from 'fs';
import { ADMIN_CATAGOERY, ADMIN_CREATE_CATAGOERY, ADMIN_DELETE_CATAGOERY, ADMIN_SEARCH_CATAGOERY, ADMIN_UPDATE_CATAGOERY } from "../../constans/endpoints.js";
const route = express.Router()

const uploadDir = './src/uploads/catagoery';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Creates the directory and its parents if needed
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
 const upload = multer({ storage: storage })
 
route.get(ADMIN_CATAGOERY,getCategoery)
route.get(ADMIN_SEARCH_CATAGOERY,searchCategoery)
route.get(ADMIN_CREATE_CATAGOERY,createCatagoeryPage)
route.post(ADMIN_CREATE_CATAGOERY,upload.single('categoery_image'),createCategoery)
route.get(ADMIN_UPDATE_CATAGOERY,updateCatagoeryPage)
route.put(ADMIN_UPDATE_CATAGOERY,upload.single('categoery_image'),updateCategoery)
route.delete(ADMIN_DELETE_CATAGOERY,deletCategoery)





export default route