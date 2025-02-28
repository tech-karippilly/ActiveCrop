import { ADMIN_COUPON_CREATE_PAGE, ADMIN_COUPON_PAGE, ADMIN_COUPON_UPDATE_PAGE } from "../../constans/page.js";
import { Coupons } from "../../models/index.js";

async function renderCoupon(req, res) {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { code: new RegExp(search, 'i') } : {};
    const coupons = await Coupons.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Coupons.countDocuments(query);
    res.status(200).render(ADMIN_COUPON_PAGE, { coupons, totalPages: Math.ceil(count / limit), currentPage: page })

  } catch (error) {

  }
}

async function renderCreateCoupon(req, res) {
  try {
    res.status(200).render(ADMIN_COUPON_CREATE_PAGE)
  } catch (error) {

  }

}

async function createCoupon(req, res) {
  try {
    const {couponCode,discountType,discountValue,minPurchaseAmount,maxDiscount,validFrom,validTo} = req.body

    const existingCoupon = await Coupons.findOne({couponCode})

    if(existingCoupon){
      return res.status(409).json({message:'Coupon already exists'})
    }

    const newCoupon = {
      code:couponCode,
      discountType:discountType,
      discountValue:discountValue,
      minPurchaseAmount:minPurchaseAmount,
      maxDiscount:maxDiscount,
      usageLimit:'10',
      validFrom:validFrom,
      validTo:validTo
    }

    const coupon = new Coupons(newCoupon)
    await coupon.save()

    res.status(201).json({ message: "Coupon Created", redirect:'/admin/coupons' })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

async function renderUpdateCoupon(req, res) {
  try{
    const {id} = req.params
    const existingCoupon = await Coupons.findById(id);
    res.status(200).render(ADMIN_COUPON_UPDATE_PAGE,{existingCoupon})
  }catch(error){

  }
}


async function updateCoupon(req, res) {
  try {
    const { id } = req.params;
    const { couponCode, discountType, discountValue, minPurchaseAmount, maxDiscount, validFrom, validTo } = req.body;

    const existingCoupon = await Coupons.findById(id);
    if (!existingCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    existingCoupon.couponCode = couponCode || existingCoupon.couponCode;
    existingCoupon.discountType = discountType || existingCoupon.discountType;
    existingCoupon.discountValue = discountValue || existingCoupon.discountValue;
    existingCoupon.minPurchaseAmount = minPurchaseAmount || existingCoupon.minPurchaseAmount;
    existingCoupon.maxDiscount = maxDiscount || existingCoupon.maxDiscount;
    existingCoupon.validFrom = validFrom || existingCoupon.validFrom;
    existingCoupon.validTo = validTo || existingCoupon.validTo;

    await existingCoupon.save();

    res.status(200).json({message:"Coupon Updated" ,redirect:"/admin/coupons"});
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again" ,error:error.message});
  }
}

async function deleteCoupon(req, res) {
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
  renderCreateCoupon,
  createCoupon,
  renderUpdateCoupon,
  updateCoupon,
  deleteCoupon
}