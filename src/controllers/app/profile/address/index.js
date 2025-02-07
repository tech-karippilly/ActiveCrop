import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../../constans/httpStatus.js";
import { USER_ADDRESS_CREATE_PAGE, USER_ADDRESS_EDIT_PAGE, USER_ADDRESS_PAGE } from "../../../../constans/page.js";
import { Address, User } from "../../../../models/index.js";

export async function renderAddressPage(req,res){
    try{
        const user = await User.findById('67930bdbd933b5aa5b33d335')
        const addressList = await Address.find({user_id:user})

        res.status(HTTP_SUCCESS).render(USER_ADDRESS_PAGE,{addressList})
    }catch(errr){
        res.status(HTTP_SERVER_ERROR).render(USER_ADDRESS_PAGE)
    }
}

export async function renderCreateAddressPage(req,res){
    try{
        res.status(HTTP_SUCCESS).render(USER_ADDRESS_CREATE_PAGE)
    }catch(errr){
        res.status(HTTP_SERVER_ERROR).render(USER_ADDRESS_CREATE_PAGE)
    }
}

export async function renderEditAddressPage(req,res){
    try{
        res.status(HTTP_SUCCESS).render(USER_ADDRESS_EDIT_PAGE)
    }catch(errr){
        res.status(HTTP_SERVER_ERROR).render(USER_ADDRESS_EDIT_PAGE)
    }
}