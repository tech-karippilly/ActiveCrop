import { ReferralOffer } from "../../../models/index.js"

async function renderCreateReferalPage(req,res){
}

async function createReferalOffer(req,res){
    try{
        const {title,description,rewardAmount} =req.body

        const existingOffer = await ReferralOffer.findOne({title})

        if(existingOffer){
            return res.status(409).json({message:"offer already exists.."})
        }

       const newOffer =  new ReferralOffer({
        title,
        description,
        rewardAmount
        })
        await newOffer.save()
        res.status(201).json({message:"Referal offer created",redirect: '/admin/offers'})
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

async function renderUpdateReferalPage(req,res){

}

async function updateReferal(req,res){
    try{
        const {id} = req.params
        const {title,description,rewardAmount} =req.body
        const existingOffer = await ReferralOffer.findById(id)

        if(!existingOffer){
            return res.status(404).json({message:"offer Not found"})
        }

        existingOffer.title = title ?? existingOffer.title;
        existingOffer.description = description ?? existingOffer.description;
        existingOffer.rewardAmount = rewardAmount ?? existingOffer.rewardAmount;

        res.status(200).json({message:'Offer Updated',redirect: '/admin/offers'})
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

async function deleteReferal(req,res){
    try{

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

export {
    renderCreateReferalPage,
    createReferalOffer,
    renderUpdateReferalPage,
    updateReferal,
    deleteReferal
}