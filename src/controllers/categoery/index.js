import { HTTP_CONFICT, HTTP_NOT_FOUND, HTTP_SERVER_ERROR, HTTP_SUCCESS } from '../../constans/httpStatus.js';
import { ADMIN_CATAGOERY_CREATE_PAGE, ADMIN_CATAGOERY_EDIT_PAGE, ADMIN_CATAGOERY_LIST_PAGE } from '../../constans/page.js';
import { Categoery } from '../../models/index.js'
import dotenv from 'dotenv';
import { ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING } from '../../utils/alert.js';
import { ADMIN_CATAGOERY_BASE } from '../../constans/endpoints.js';
import { deleteImageFromCloudinary, uploadImage } from '../../services/cloudinary.js';
dotenv.config();



export const catagoeryPage = (req, res) => {
    res.status(200).render('admin/categoery/index', { activePage: "Categoery", alertMessage: '', alertType: '', redirectUrl: '', data: [] })
}

const getCategoery = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let skip = (page - 1) * limit;

        const total = await Categoery.countDocuments();
        const catagoery = await Categoery.find({}).skip(skip).limit(limit);

        return renderPage(ADMIN_CATAGOERY_LIST_PAGE, res, HTTP_SUCCESS, '', '', '', {
            catagoery,
            total,
            page,
            limit
        });
    } catch (error) {
        return renderPage(ADMIN_CATAGOERY_LIST_PAGE, res, HTTP_SERVER_ERROR, 'Internal Server Error', '', '', {
            catagoery: [],
            total: 0,
            page: 1,
            limit: 10
        });
    }
};

export const createCatagoeryPage = (req, res) => {
    renderPage(ADMIN_CATAGOERY_CREATE_PAGE, res, HTTP_SUCCESS, '', '', '', [])
}

const createCategoery = async (req, res) => {
    try {
        const { cataName, description } = req.body
        const cataDetails = await Categoery.findOne({ catagoery_name: { $regex: cataName, $options: 'i' } })
        if (cataDetails) {
            return renderPage(ADMIN_CATAGOERY_CREATE_PAGE, res, HTTP_CONFICT, 'Categoery Already Exits', ALERT_WARNING, '', [])
        }

        let fileName = ''
        if (req.file) {
            try {
                const cloudinaryResponse = await uploadImage(req.file.path, 'categories');
                fileName = cloudinaryResponse.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                return res.status(500).json({ message: "Failed to upload image" });
            }
        }
        const catagoery = new Categoery({ catagoery_name: cataName, description: description, image: fileName })



        await catagoery.save()
        return renderPage(ADMIN_CATAGOERY_CREATE_PAGE, res, HTTP_SUCCESS, 'Categoery Created Successfully', ALERT_SUCCESS, ADMIN_CATAGOERY_BASE, [])
    } catch (error) {
        return renderPage(ADMIN_CATAGOERY_CREATE_PAGE, res, HTTP_SERVER_ERROR, 'Internal Server error', ALERT_DANGER, '', [])
    }
}

export const updateCatagoeryPage = async (req, res) => {
    try {
        const { id } = req.params
        const catagoery = await Categoery.findById({ _id: id })
        return renderPage(ADMIN_CATAGOERY_EDIT_PAGE, res, HTTP_SUCCESS, '', '', '', catagoery)
    } catch (error) {
        return renderPage(ADMIN_CATAGOERY_EDIT_PAGE, res, HTTP_SERVER_ERROR, 'Internal server Error', ALERT_DANGER, "", {})
    }
}

const updateCategoery = async (req, res) => {
    try {
        const cata_id = req.params.id
        const { cataName, description } = req.body
        const cataDetails = await Categoery.findById(cata_id);
        if (cataDetails) {
            if (req.file){
                if (cataDetails.image){
                    const publicId = cataDetails.image.split("/").pop().split(".")[0];
                    await deleteImageFromCloudinary(`categories/${publicId}`);
                    const cloudinaryResponse = await uploadImage(req.file.path, 'categories');
                    cataDetails.image = cloudinaryResponse.secure_url;
                }
            }

            cataDetails.catagoery_name = cataName
            cataDetails.description = description
            await cataDetails.save()
            return res.status(HTTP_SUCCESS).json({ message: 'Catagoery Updated Succssfully ', redirectUrl: ADMIN_CATAGOERY_BASE })
        }
        return res.status(HTTP_NOT_FOUND).json({ message: 'Categoery Not  Found' })
    } catch (error) {

        return res.status(HTTP_SERVER_ERROR).json({ message: "Internal Server Error", })
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
        return renderPage(ADMIN_CATAGOERY_LIST_PAGE, res, HTTP_SUCCESS, '', '', '', catagoery)
    } catch (error) {
        return renderPage(ADMIN_CATAGOERY_LIST_PAGE, res, HTTP_SERVER_ERROR, 'Internal Server Error', ALERT_DANGER, '', [])
    }
}

const renderPage = (pageName, res, status, alertMessage, alertType, redirectUrl, data) => {
    res.status(status).render(pageName, { activePage: "Categoery", alertMessage, alertType, redirectUrl, data })
}

export { createCategoery, getCategoery, updateCategoery, deletCategoery, searchCategoery }