import { Categoery, CategoryOffer } from "../../../models/index.js";

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
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        } 
    }
    
    async function renderupdateCategoryPage(req,res){
        try{
            const {offer_id} = req.params
            const offerTypes = ['percentage', 'flat_discount'];
            const catagoery = await Categoery.find()
            const existingOffer = await CategoryOffer.findById(offer_id)
            res.status(200).render(ADMIN_OFFERS_CATAGOERY_UPDATE,{offerTypes,catagoery,existingOffer})
        }catch(error){
            res.status(500).render(ADMIN_OFFERS_CATAGOERY_UPDATE,{offerTypes:[],catagoery:[],existingOffer:{}})
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
            res.status(200).json({ message: "Category offer updated successfully", updatedOffer: existingOffer ,redirect: '/admin/offers'});
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
    
    async function deleteCategoryOffer(req, res) {
        try {
            const { id } = req.params; 
    
            const existingOffer = await CategoryOffer.findById(id);
            if (!existingOffer) {
                return res.status(404).json({ message: "Category offer not found" });
            }
    
            await CategoryOffer.findByIdAndDelete(id);
    
            res.status(200).json({ message: "Category offer deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }


    export{
        rendercreateCategoryPage,
        createCategoryOffer,
        renderupdateCategoryPage,
        updateCategoryOffer,
        deleteCategoryOffer
    }