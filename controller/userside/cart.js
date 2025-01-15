const cartSchema = require('../../model/cartSchema')
const productSchema = require('../../model/productSchema')
const couponSchema = require('../../model/couponSchema')

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

            //Find product id if exist
            const existProduct = existUser.products.find((item)=>item.productId.toString() == productId)    

            //Check if product already exist
            if(existProduct){
                return res.json({ message: 'product already added to cart'}) 
            }

            //Assign gross amount with its price
            grossAmount = product.price*1

            //Add the gross amounts and assign it to total amount
            const totalAmount = existUser.totalAmount += grossAmount
            
            //Pust the gross amount and productId to the existing user
            existUser.products.push({productId, grossAmount})
            
            //Update and save
            await cartSchema.findByIdAndUpdate( existUser._id, { products: existUser.products, totalAmount})
            
            //Return a success response
            return res.json({message: 'product added to cart successfullly'}) 
        }

        //Assign gross amount with its price
        grossAmount = product.price * 1

        //Create new document 
        const cart = await cartSchema({
            userId,
            products: {productId,grossAmount},
            totalAmount: product.price * 1
             
        })

        //Save the to the collection
        await cart.save()    
    
        //Return a success response
        res.status(200).json({ message: 'product added to cart successfully'})  

        }
    catch(error){

        //console the error
        console.error( 'error in add to cart', error);
        res.status(500).json({ error: 'error in add to cart'})
    }
}

// Handller to decrese and increse the quantity of products
const quantity = async(req,res)=>{
    
    //Take users id through requrest objects
    const userId = req.user.userId

    //Take productId through request parameters
    const productId = req.params.productId

    //Take quantitu through request body
    const {quantity} = req.body

    //Find product with its id
    const product = await productSchema.findOne({ _id: productId})

    //Find cart by with user id
    const cart = await cartSchema.findOne({userId})

    //Check if quantity given through request body 
    if(quantity){

        //
        const Product = cart.products.find((item) => item.productId.toString() == productId)

        if(!Product){
            return res.status(404).json({message: 'product not found'})
        }
        
        //Increase quantity
        const totalquantity = Product.quantity += 1
        Product.grossAmount = totalquantity * product.price
        
        // Update cart total amount
        cart.totalAmount = cart.products.reduce((total, product) => {
            return total + product.grossAmount;
          }, 0);
          
        await cart.save() 
        return res.status(200).json({message:'quantity is incresed'}) 

    }
    else{
        //Decrease quantity
        const Product = cart.products.find((item) => item.productId.toString() == productId)
        Product.quantity -= 1
        Product.grossAmount = Product.quantity * product.price;
        // Update cart total amount
        cart.totalAmount = cart.products.reduce((total, product) => {
            return total + product.grossAmount;
          }, 0);
        
        //save its quantity  
        await cart.save()
        res.status(200).json({message:'quantity is decresed'})

    }

}

// Handler to apply a coupon
const couponApply = async(req,res)=>{
    try{
        
        // Extract user ID from the request object
        const userId = req.user.userId

        // Extract the coupon code from the request body
        const {code} = req.body

        // Extract product ID from the request parameters
        const productId = req.params.productId

        // Look for the coupon in the database using the provided code
        const coupon = await couponSchema.findOne({code})
        
        //If coupon does not exist , return an error response
        if(!coupon){
            return res.status(400).json({ message: 'coupon not found'})
        }
        
        //Check if coupon is valid for the specific products
        if(productId !== coupon.productId.toString()){
            return res.json({ message: 'coupon not valid for this product'})
        }

         // Find the product in the database using the product ID
        const product = await productSchema.findOne({_id:productId})

        // Find the user's cart in the database using the user ID
        const cart = await cartSchema.findOne({userId})

        //Calculate its discount amount with its percentage
        const discountedPercentage = coupon.discountPercentage/100
        const discountAmount = product.price * discountedPercentage 
 
        // Find the specific product in the user's cart
        const findedProduct = cart.products.find((item) => item.productId.toString() == productId)     
       
        // Deduct the discount amount from the product's gross amount
        findedProduct.grossAmount -= discountAmount

        cart.discountAmount = (cart.discountAmount || 0) + discountAmount

        // Recalculate its total amount
        cart.totalAmount = cart.products.reduce((total,product)=>{
            return total + product.grossAmount
        },10)

        // Save the updated cart to the database
        await cart.save()

        // Return a success response indicating the coupon was applied
        return res.json({message: 'copon applyed successfully'})

    } 
   catch(error){

    // Handle any error occure during the proccess
    res.status(500).json({error:'error in coupon apply'})
    console.error(error);
   }

}

//viewCart Handller
const viewCart = async(req,res)=>{

    try{

        // Extract user ID from the request object
        const userId = req.user.userId

        // Find the user's cart and populate product details from the product schema
        const cart = await cartSchema.findOne({ userId }).populate({ path:'products.productId', select: '-_id -__v'})

        // If the cart does not exist or is empty, return a 400 response
        if(!cart){
            return res.status(400).json({ message: 'users cart is empty'})
        }

        // Return the cart details in the response
        res.status(200).json({cart})

    }
    catch(error){
        // Handle any errors and return a 500 response
        console.error('error in view cart', error);       
        res.status(500).json({error: 'error in viewcart'})
    }
}

//Handler to remove cart   
const removeCart = async(req,res)=>{

    try{
        // Extract user ID from the request object
        const userId = req.user.userId

        // Extract product ID from the request parameters
        const productId = req.params.productId

        // Remove the specified product from the user's cart
        const updatedCart = await cartSchema.findOneAndUpdate( {userId}, { $pull: { products:{ productId }}},{new: true})

        // If the cart does not exist or the product was not found, return a 404 response
        if (!updatedCart) {
        return res.status(404).json({ message: 'Cart or product not found' });
        }
  
        // Return a success response
        res.status(200).json({ message: 'product is removed from cart'}) 
        
        // Recalculate the cart's total amount
        updatedCart.totalAmount = updatedCart.products.reduce(( total, product)=>{
            return total + product.grossAmount
        }, 0)
        
        // Save the updated cart to the database
        await updatedCart.save()
        
    }
    catch(error){
        
        // Handle any error and returen error response
        console.error('error in remove from cart', error);
        res.status(500).json({ error: 'error in remove from cart'})
    }
   
}


module.exports = { addToCart, removeCart, viewCart, quantity, couponApply}