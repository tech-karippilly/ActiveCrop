import { HTTP_CONFICT, HTTP_NOT_FOUND, HTTP_SERVER_ERROR, HTTP_SUCCESS } from '../../constans/httpStatus.js';
import { ADMIN_CATAGOERY_CREATE_PAGE, ADMIN_CATAGOERY_EDIT_PAGE, ADMIN_CATAGOERY_LIST_PAGE } from '../../constans/page.js';
import { Categoery } from '../../models/index.js'
import dotenv from 'dotenv';
import { ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING } from '../../utils/alert.js';
import { ADMIN_CATAGOERY, ADMIN_CATAGOERY_BASE, ADMIN_CREATE_CATAGOERY } from '../../constans/endpoints.js';
import { ADMIN_CATAGOERY_ROUTE } from '../../constans/index.js';
dotenv.config();



export const catagoeryPage = (req, res) => {
    res.status(200).render('admin/categoery/index', { alertMessage: '', alertType: '', redirectUrl: '', data: [] })
}

const getCategoery = async (req, res) => {
    try {
        const catagoery = await Categoery.find({})
        return renderPage(ADMIN_CATAGOERY_LIST_PAGE, res, HTTP_SUCCESS, '', '', '', catagoery)
    } catch (error) {
        return renderPage(ADMIN_CATAGOERY_LIST_PAGE, res, HTTP_SERVER_ERROR, 'Internal Server Error', '', '', [])
    }
}

export const createCatagoeryPage = (req, res) => {
    renderPage(ADMIN_CATAGOERY_CREATE_PAGE,res,HTTP_SUCCESS,'','','',[])
}

const createCategoery = async (req, res) => {
    try {
        const { cataName, description } = req.body
        const cataDetails = await Categoery.findOne({ catagoery_name: cataName })
        if (cataDetails) {
            return renderPage(ADMIN_CATAGOERY_CREATE_PAGE,res,HTTP_CONFICT,'Categoery Already Exits',ALERT_WARNING,'',[])
        }
        const filePath = JSON.parse(JSON.stringify(req.file))
        const fileName = `${process.env.HOST_URL}/${filePath.path}`
        const catagoery = new Categoery({ catagoery_name: cataName, description: description, image: fileName })
        await catagoery.save()
        return renderPage(ADMIN_CATAGOERY_CREATE_PAGE,res,HTTP_SUCCESS,'Categoery Created Successfully',ALERT_SUCCESS,ADMIN_CATAGOERY_BASE,[])
    } catch (error) {
        return renderPage(ADMIN_CATAGOERY_CREATE_PAGE,res,HTTP_SERVER_ERROR,'Internal Server error',ALERT_DANGER,'',[])
    }
}

export const updateCatagoeryPage = async (req, res) => {
    try {
        const { id } = req.params
        const catagoery = await Categoery.findById({ _id: id })
        return renderPage(ADMIN_CATAGOERY_EDIT_PAGE,res,HTTP_SUCCESS,'','','',catagoery)
    } catch (error) {
        return renderPage(ADMIN_CATAGOERY_EDIT_PAGE,res,HTTP_SERVER_ERROR,'Internal server Error',ALERT_DANGER,"",{})
    }
}

const updateCategoery = async (req, res) => {
    try {
        const cata_id = req.params.id
        const { cataName, description } = req.body
        const cataDetails = await Categoery.findById(cata_id);
        if (cataDetails) {
            const filePath = JSON.parse(JSON.stringify(req.file))
            const fileName = `${process.env.HOST_URL}/${filePath.path}`
            cataDetails.catagoery_name = cataName
            cataDetails.description = description
            cataDetails.image = fileName
            await cataDetails.save()
            return res.status(HTTP_SUCCESS).json({ message: 'Catagoery Updated Succssfully ',redirectUrl:ADMIN_CATAGOERY_BASE })
        }
      return  res.status(HTTP_NOT_FOUND).json({message:'Categoery Not  Found'})
    } catch (error) {
        
       return res.status(HTTP_SERVER_ERROR).json({ message: "Internal Server Error",})
    }
}

const deletCategoery = async (req, res) => {
    try {
        const cata_id = req.params.id
        const cataDetails = await Categoery.findById(cata_id)
        if (cataDetails) {
            const deleteCatagoery = await Categoery.deleteOne({ _id: cata_id })
            if (deleteCatagoery.deletedCount === 1) {
                return res.status(200).json({ message: "Categoery Deleted Successfully", status: 200 })
            }
            return res.status(400).json({ message: "Bad Request", status: 400 })
        }
        res.status(404).json({ message: "Categoery Not Found", status: 204 })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", status: 500 })
    }
}

const searchCategoery = async (req, res) => {
    try {
        const { searchString } = req.query
        const catagoery = await Categoery.find({ catagoery_name: { $regex: searchString, $options: 'i' } })
      return  renderPage(ADMIN_CATAGOERY_LIST_PAGE,res,HTTP_SUCCESS,'','','',catagoery)
    } catch (error) {
       return renderPage(ADMIN_CATAGOERY_LIST_PAGE,res,HTTP_SERVER_ERROR,'Internal Server Error',ALERT_DANGER,'',[])
    }
}

const renderPage = (pageName, res, status, alertMessage, alertType, redirectUrl, data) => {
    res.status(status).render(pageName, { alertMessage, alertType, redirectUrl, data })
}

export { createCategoery, getCategoery, updateCategoery, deletCategoery, searchCategoery }