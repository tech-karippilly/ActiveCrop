import express from "express";
import { createRole, deleteRole, getRole } from "../../controllers/roles/index.js";
const route = express.Router()



route.get('/',getRole)
route.post('/createRoles',createRole)
route.delete('/:id',deleteRole)


export default route