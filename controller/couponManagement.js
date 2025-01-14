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

// Handller to update coupon
const updateCoupon = async(req,res)=>{
    try{

        // Extract id from request parameter
        const id = req.params.id

        // Extract coupon code from request body
        const updatedCoupon = req.body

        // Find coupon by its id 
        const coupon =  await couponSchema.findOne({_id:id})

        // Return a error response if coupon not found
        if(!coupon){
            return res.status(404).json ({message: 'coupon not found'})
        }
        
        // Find by its id and update
        await couponSchema.findByIdAndUpdate( id, updatedCoupon) 

        // Return a success response
        res.status(200).json({ message: 'coupon updated successfully'})
    }
    catch(error){
        
        //Handle any errors
        console.error('error in update coupon');
        res.json({ error: 'error in update coupon'})
        
    }
    
}

//Handler to delete coupon
const deleteCoupon = async(req, res)=>{
    try{

        // Extract id from request parameter
        const id = req.params.id

        // Find coupon by its id 
        const coupon =  await couponSchema.findOne({_id:id})

        // Return a error response if coupon not found
        if(!coupon){
            return res.json ({message: 'coupon not found'})
        }

        // Find by its id and delete
        await couponSchema.findByIdAndDelete(id)

        // Return a success response
        res.status(200).json({ message: 'coupon deleted successfully'})
    }
    catch{

        // Handle any error
        console.error('error in delete coupon');
        res.json({ error: 'error in delete coupon'})
    }
}

// Hanller to view all coupon
const viewCoupons = async(req,res)=>{
    try{

        // find all coupon
        const coupon = await couponSchema.find()

        // Return a success response with all coupon
        res.status(200).json({message: 'coupon viewed successfully',
            coupon
        })
    }
    catch(error){

        // Handle all any errors
        console.error('error in view coupon');
        res.json({ error: 'error in view coupon'})
    }
}

module.exports = {createCoupon, updateCoupon, deleteCoupon, viewCoupons} 