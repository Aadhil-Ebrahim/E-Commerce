const cartSchema = require('../../model/cartSchema')
const couponSchema = require('../../model/couponSchema')
const userSchema = require('../../model/userSchema')
const productSchema = require('../../model/productSchema')
const { default: mongoose } = require('mongoose')


//Handller to add product  to cart
const addToCart = async(req,res)=>{
    try{
        //Take userId from request object
        const userId = req.user.userId  
        
        //Take product id through route parameter
        const productId = req.params.productId

        const product = await productSchema.findOne({_id: productId})
        
        //Find user if already exist 
        const existUser = await cartSchema.findOne({userId})
       

        //Check if user exist
        if(existUser){

            const existProduct = existUser.products.find((item)=>item.productId.toString() == productId)            
       
            if(existProduct){
                return res.json({ message: 'product already added to cart'}) 
            }
                        
            existUser.products.push({productId})
            
            await cartSchema.findByIdAndUpdate( existUser._id, { products: existUser.products})
            
            return res.json({message: 'product added to cart successfullly'}) 
        }

        const cart = await cartSchema({
            userId,
            products: {productId},
            totalAmount: product.price * 1
            
        })

        await cart.save()    
    
        res.status(200).json({ message: 'product added to cart successfully'})  

        }
    catch(error){

        console.error( 'error in add to cart', error);
        res.status(500).json({ error: 'error in add to cart'})
        
    }
}

const quantity = async(req,res)=>{

    const userId = req.user.userId
    const productId = req.params.productId
    const {quantity} = req.body
    const product = await productSchema.findOne({ _id: productId})
    

    const cart = await cartSchema.findOne({userId})
    if(quantity){

        const Product = cart.products.find((item) => item.productId.toString() == productId)
        const totalquantity = Product.quantity += 1
        cart.totalAmount = product.price * totalquantity
        
        await cart.save()
        return res.json({message:'quantity  is incresed'})

    }
    else{
        const Product = cart.products.find((item) => item.productId.toString() == productId)
        const totalquantity = Product.quantity -= 1
        cart.totalAmount -= product.price
        
        await cart.save()
        res.json({message:'quantity is decresed'})

    }

}
const viewCart = async(req,res)=>{

    try{

        const userId = req.user.userId

        // const cart = await cartSchema.findOne({ userId }).populate('products.productId')

        const cart = await cartSchema.aggregate([
            {$match:{userId: new mongoose.Types.ObjectId(userId)}},
            {$lookup:{
                from:'products',
                localField:'products.productId',
                foreignField: '_id',
                as:'cart'
            }},
            {$unwind: '$cart'},
            {$project: {
                name:'$cart.name',
                price: '$cart.price',
                 
            }}
        ])

        console.log(cart);
        

        if(!cart){
            return res.status(400).json({ message: 'users cart is empty'})
        }

        res.status(200).json({message: cart})

    }
    catch(error){
        console.error('error in view cart', error);       
        res.status(500).json({error: 'error in viewcart'})
    }
}
   
const removeCart = async(req,res)=>{

    try{
        const userId = req.user.userId
        const productId = req.params.productId
        // const product = await productSchema.findOne({_id:})
        const existUser = await cartSchema.findOne({userId})
    
        const product = await cartSchema.updateOne({userId}, { $pull: { products:{ productId }}})
        console.log(product);
        
    
        res.status(200).json({ message: 'product is removed from cart'})
    
    }
    catch(error){

        console.error('error in remove from cart', error);
        res.status(500).json({ error: 'error in remove from cart'})
    }
   
}


module.exports = { addToCart, removeCart, viewCart, quantity}