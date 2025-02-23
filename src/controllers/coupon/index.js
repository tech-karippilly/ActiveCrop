import { ADMIN_COUPON_PAGE } from "../../constans/page.js";
import { Coupons } from "../../models/index.js";

async function renderCoupon(req,res){
  try{
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { code: new RegExp(search, 'i') } : {};
    const coupons = await Coupons.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
    const count = await Coupons.countDocuments(query);
    res.status(200).render(ADMIN_COUPON_PAGE,{coupons, totalPages: Math.ceil(count / limit), currentPage: page})

  }catch(error){

  }
}

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
  renderCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
}