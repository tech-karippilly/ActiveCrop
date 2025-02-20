import { ADMIN_OFFERS_REFERAL_CREATE, ADMIN_OFFERS_REFERAL_UPDATE } from "../../../constans/page.js"
import { ReferralOffer } from "../../../models/index.js"

async function renderCreateReferalPage(req, res) {
    try {
        res.status(200).render(ADMIN_OFFERS_REFERAL_CREATE)
    } catch (error) {
        res.status(500).render(ADMIN_OFFERS_REFERAL_CREATE)
    }
}

async function createReferalOffer(req, res) {
    try {
        const { title, description, rewardAmount } = req.body

        const existingOffer = await ReferralOffer.findOne({ title })

        if (existingOffer) {
            return res.status(409).json({ message: "offer already exists.." })
        }

        const newOffer = new ReferralOffer({
            title,
            description,
            rewardAmount
        })
        await newOffer.save()
        res.status(201).json({ message: "Referal offer created", redirect: '/admin/offers' })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function renderUpdateReferalPage(req, res) {
    try {
        
        const { id } = req.params
        const exsitingOffer = await ReferralOffer.findById(id)
        console.log(exsitingOffer)
        res.status(200).render(ADMIN_OFFERS_REFERAL_UPDATE, { exsitingOffer })
    } catch (error) {
        console.log(error.message)
        res.status(500).render(ADMIN_OFFERS_REFERAL_UPDATE, { exsitingOffer: {} })
    }
}

async function updateReferal(req, res) {
    try {
        const { id } = req.params
        const { title, description, rewardAmount } = req.body
        const existingOffer = await ReferralOffer.findById(id)

        if (!existingOffer) {
            return res.status(404).json({ message: "offer Not found" })
        }

        existingOffer.title = title ?? existingOffer.title;
        existingOffer.description = description ?? existingOffer.description;
        existingOffer.rewardAmount = rewardAmount ?? existingOffer.rewardAmount;

        await existingOffer.save()
        res.status(200).json({ message: 'Offer Updated', redirect: '/admin/offers' })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

async function deleteReferal(req, res) {
    try {
        const { id } = req.params
        const existingOffer = await ReferralOffer.findById(id)

        if (!existingOffer) {
            return res.status(404).json({ message: "offer Not found" })
        }
        await ReferralOffer.findByIdAndDelete(id)
        res.status(200).json({ message: 'Offer Deleted' })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export {
    renderCreateReferalPage,
    createReferalOffer,
    renderUpdateReferalPage,
    updateReferal,
    deleteReferal
}