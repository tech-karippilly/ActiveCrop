import express from "express";
import { createCatagoeryPage, createCategoery, deletCategoery, getCategoery, searchCategoery, updateCatagoeryPage, updateCategoery } from "../../controllers/categoery/index.js";
import { ADMIN_CATAGOERY, ADMIN_CREATE_CATAGOERY, ADMIN_DELETE_CATAGOERY, ADMIN_SEARCH_CATAGOERY, ADMIN_UPDATE_CATAGOERY } from "../../constans/endpoints.js";
import { uploadCategory } from "../../config/multerCofig.js";
const route = express.Router()
 
route.get(ADMIN_CATAGOERY,getCategoery)
route.get(ADMIN_SEARCH_CATAGOERY,searchCategoery)
route.get(ADMIN_CREATE_CATAGOERY,createCatagoeryPage)
route.post(ADMIN_CREATE_CATAGOERY,uploadCategory.single('categoery_image'),createCategoery)
route.get(ADMIN_UPDATE_CATAGOERY,updateCatagoeryPage)
route.put(ADMIN_UPDATE_CATAGOERY,uploadCategory.single('categoery_image'),updateCategoery)
route.delete(ADMIN_DELETE_CATAGOERY,deletCategoery)





export default route