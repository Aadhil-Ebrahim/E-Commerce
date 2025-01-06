const couponSchema = require('../model/couponSchema')

//Handler to create coupon
const createCoupon = async(req, res) =>{

    try{
        //Take coupons details through body
        const { code, discountPercentage, productId, usageLimit } = req.body

        //Check if all fields doest exist
        if(!code || !discountPercentage || !productId || !usageLimit){
        return res.json({message: 'all fields are required'})
        }

        const coupon = await couponSchema ({
        code, discountPercentage, productId, usageLimit
         })

        //Save it to the database
        await coupon.save()

        //Return a success response
        res.status(200).json({message: 'coupon created succesfully'})
    }
    catch(error){
        console.error('error in create coupon', error);
        res.json({ error: 'error in create coupon'})
    }
    
}

const updateCoupon = async(req,res)=>{
    try{
        const id = req.params.id
        const updatedCoupon = req.body
        const coupon =  await couponSchema.findOne({_id:id})
        if(!coupon){
            return res.json ({message: 'coupon not found'})
        }
        
        await couponSchema.findByIdAndUpdate( id, updatedCoupon) 
        res.json({ message: 'coupon updated successfully'})
    }
    catch(error){
        console.error('error in update coupon');
        res.json({ error: 'error in update coupon'})
        
    }
    
}

const deleteCoupon = async(req, res)=>{
    try{
        const id = req.params.id
        const coupon =  await couponSchema.findOne({_id:id})
        if(!coupon){
            return res.json ({message: 'coupon not found'})
        }
        await couponSchema.findByIdAndDelete(id)
        res.status(200).json({ message: 'coupon deleted successfully'})
    }
    catch{
        console.error('error in delete coupon');
        res.json({ error: 'error in delete coupon'})
    }
}

const viewCoupons = async(req,res)=>{
    try{
        const coupon = await couponSchema.find()
        res.status(200).json({message: 'coupon viewed successfully',
            coupon
        })
    }
    catch(error){
        console.error('error in view coupon');
        res.json({ error: 'error in view coupon'})
    }
}

module.exports = {createCoupon, updateCoupon, deleteCoupon, viewCoupons} 