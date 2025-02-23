import { Coupons } from "../../models/index.js";

async function createCoupon(req,res){
    try{
        const coupon = new Coupons(req.body)

        await coupon.save()
        res.status(201).json({message:"Coupon Created",coupon})
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
}

async function updateCoupon(req,res) {
    try {
        const coupon = await Coupons.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
        res.json(coupon);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

async function deleteCoupon(req,res){
    try {
        const coupon = await Coupons.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
        res.json({ message: 'Coupon deleted successfully' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

export {
    createCoupon,
    updateCoupon,
    deleteCoupon
}