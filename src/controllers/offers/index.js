import { HTTP_CREATE, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constans/httpStatus.js"
import { ADMIN_OFFERS_CATAGOERY_CREATE, ADMIN_OFFERS_CATAGOERY_UPDATE, ADMIN_OFFERS_CREATE_PAGE, ADMIN_OFFERS_EDIT_PAGE, ADMIN_OFFERS_PAGE } from "../../constans/page.js"
import { Categoery, CategoryOffer, Product, productOffer } from "../../models/index.js"


async function renderOfferPage(req, res) {
    try {
        const catagoeryOffers = await CategoryOffer.find()
        const products = await productOffer.find()
        console.log("catagoeryOffers", catagoeryOffers)
        console.log("products", products)
        res.status(HTTP_SUCCESS).render(ADMIN_OFFERS_PAGE, { catagoeryOffers, products });
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).render(ADMIN_OFFERS_PAGE)
    }
}

async function renderCreatePage(req, res) {
    try {
        const products = await Product.find({ catagoery_id: '6793fd0029c4fd78c2423e98' })
        const catagoery = await Categoery.find()
        console.log("products", products)
        const offerTypes = ['percentage', 'flat_discount'];
        res.status(HTTP_SUCCESS).render(ADMIN_OFFERS_CREATE_PAGE, { catagoery, products, offerTypes, });
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).render(ADMIN_OFFERS_CREATE_PAGE, { catagoery: [], products: [], offerTypes: [] });
    }
}

async function renderEditPage(req, res) {
    try {
        const { id } = req.params
        const existingOffer = await productOffer.findById(id)
        const catagoery = await Categoery.find()
        const offerTypes = ['percentage', 'flat_discount'];
        const products = await Product.find({ catagoery_id: '6793fd0029c4fd78c2423e98' })
        console.log(catagoery)
        res.status(200).render(ADMIN_OFFERS_EDIT_PAGE, { offerTypes, catagoery, products, existingOffer })
    } catch (error) {
        res.status(500).render(ADMIN_OFFERS_EDIT_PAGE, { existingOffers: {}, catagoery: [], products: [], offerTypes: [] })
    }
}

async function editProductOffer(req, res) {
    try {
        const { id } = req.params
        const { offer_type, discountValue, min_quantity, max_discount } = req.body;

        const existingOffer = await productOffer.findById(id)

        existingOffer.offer_type = offer_type ?? existingOffer.offer_type;
        existingOffer.discountValue = discountValue ?? existingOffer.discountValue;
        existingOffer.min_quantity = min_quantity ?? existingOffer.min_quantity;
        existingOffer.max_discount = max_discount ?? existingOffer.max_discount;

        await existingOffer.save();
        res.status(200).json({ message: "Offer updated successfully", alertType: 'alert-success', redirect: '/admin/offers', offer: existingOffer, });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function deleteProductOffer(req, res) {
    try {
        const { id } = req.params
        const existingOffer = await productOffer.findOneAndDelete({ _id: id });

        if (!existingOffer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        res.status(HTTP_SUCCESS).json({ message: "Offer deleted successfully" });
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({ message: "Internal Server Error", error: error.message });
    }

}

async function createProductOffer(req, res) {
    try {
        const { productId, offer_type, discountValue, valid_from, valid_until, min_quantity, max_discount } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found", alertType: "alert-danger" });
        }

        const existingOffer = await productOffer.findOne({
            "product._id": productId,
            valid_until: { $gte: new Date() }
        });

        if (existingOffer) {
            return res.status(400).json({ message: "Product already has an active offer", alertType: "alert-warning" });
        }

        const productDetails = {
            product_name: product.product_name,
            _id: product._id,
        };

        const offer = new productOffer({
            product: productDetails,
            offer_type,
            discountValue: Number(discountValue),
            valid_from,
            valid_until,
            min_quantity: Number(min_quantity),
            max_discount: Number(max_discount)
        });

        await offer.save();

        res.status(HTTP_CREATE).json({ message: 'Offer created successfully', alertType: 'alert-success', redirect: '/admin/offers' });
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).json({ message: "Internal Server Error", error: error.message });
    }
}


async function rendercreateCategoryPage(req,res){
try{
    const offerTypes = ['percentage', 'flat_discount'];
    const catagoery = await Categoery.find()
    res.status(200).render(ADMIN_OFFERS_CATAGOERY_CREATE,{offerTypes,catagoery})
}catch(error){
    res.status(500).render(ADMIN_OFFERS_CATAGOERY_CREATE,{offerTypes:[],catagoery:[]})
}
}
async function createCategoryOffer(req, res) {
    try {
        const { category_id, offer_type, discountValue, valid_from, valid_until, min_quantity, max_discount } = req.body;

        const getCategory = await Categoery.findById(category_id);
        if (!getCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const currentCategoryOffer = await CategoryOffer.find({ 'category._id': category_id });

        if (currentCategoryOffer.length > 0) {
            return res.status(400).json({ message: 'Offer already exists' });
        }
        const category ={
            id:category_id,
            category_name:getCategory.catagoery_name
        }

        const newCategoryOffer = new CategoryOffer({
            category,
            offer_type,
            discountValue,
            valid_from,
            valid_until,
            min_quantity,
            max_discount,
        });

        await newCategoryOffer.save();
        res.status(201).json({ message: "Category offer created", redirect: '/admin/offers' });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } 
}

async function renderupdateCategoryPage(req,res){
    try{
        const {id} = req.params
        const offerTypes = ['percentage', 'flat_discount'];
        const catagoery = await Categoery.find()
        const existingOffer = await CategoryOffer.findById(id)
        res.status(200).render(ADMIN_OFFERS_CATAGOERY_UPDATE,{offerTypes,catagoery,existingOffer})
    }catch(error){
        res.status(500).render(ADMIN_OFFERS_CATAGOERY_UPDATE,{offerTypes:[],catagoery:[],existingOffer})
    }
}

async function updateCategoryOffer(req, res) {
    try {
        const { offer_id } = req.params; 
        const { offer_type, discountValue, valid_from, valid_until, min_quantity, max_discount } = req.body;

        const existingOffer = await CategoryOffer.findById(offer_id);
        if (!existingOffer) {
            return res.status(404).json({ message: "Category offer not found" });
        }

        existingOffer.offer_type = offer_type || existingOffer.offer_type;
        existingOffer.discountValue = discountValue || existingOffer.discountValue;
        existingOffer.valid_from = valid_from || existingOffer.valid_from;
        existingOffer.valid_until = valid_until || existingOffer.valid_until;
        existingOffer.min_quantity = min_quantity || existingOffer.min_quantity;
        existingOffer.max_discount = max_discount || existingOffer.max_discount;

        await existingOffer.save();
        res.status(200).json({ message: "Category offer updated successfully", updatedOffer: existingOffer });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function deleteCategoryOffer(req, res) {
    try {
        const { offer_id } = req.params; 

        const existingOffer = await CategoryOffer.findById(offer_id);
        if (!existingOffer) {
            return res.status(404).json({ message: "Category offer not found" });
        }

        await CategoryOffer.findByIdAndDelete(offer_id);

        res.status(200).json({ message: "Category offer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}



export {
    renderOfferPage,
    renderCreatePage,
    createProductOffer,
    renderEditPage,
    editProductOffer,
    deleteProductOffer,
    rendercreateCategoryPage,
    createCategoryOffer,
    renderupdateCategoryPage,
    updateCategoryOffer,
    deleteCategoryOffer
}