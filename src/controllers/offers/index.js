import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constans/httpStatus.js"
import { ADMIN_OFFERS_PAGE } from "../../constans/page.js"

async function renderOfferPage (req,res){
    try{
        res.status(HTTP_SUCCESS).render(ADMIN_OFFERS_PAGE)
    }catch(error){
        res.status(HTTP_SERVER_ERROR).render(ADMIN_OFFERS_PAGE)
    }
}

export {
    renderOfferPage
}