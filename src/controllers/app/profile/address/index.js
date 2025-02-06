import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../../constans/httpStatus.js";
import { USER_ADDRESS_CREATE_PAGE, USER_ADDRESS_EDIT_PAGE, USER_ADDRESS_PAGE } from "../../../../constans/page.js";

export async function renderAddressPage(req,res){
    try{
        res.status(HTTP_SUCCESS).render(USER_ADDRESS_PAGE)
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