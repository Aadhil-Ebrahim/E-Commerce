const orderSchema = require('../../model/orderSchema')
const addressSchema = require('../../model/addressSchema')
const cartSchema = require('../../model/cartSchema')
const productSchema = require('../../model/productSchema')

const paypal = require('paypal-rest-sdk')

paypal.configure({
    'mode':'sandbox',
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_SECRET_KEY
})

const createPayment = async (req,res)=>{
    const userId = req.user.userId
    const cart = await cartSchema.findOne({userId})
    
    const createpayment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": cart.totalAmount 
            },
            "description": "Hat for the best team ever"
        }]
    };

    paypal.payment.create(
        createpayment,
        function (error, payment) {
            if (error) {
                throw error;
            } else {
                res.send(payment.links)
                // for (let i = 0; i < payment.links.length; i++) {
                //     if (payment.links[i].rel === 'approval_url') {
                //         res.send(payment.links[i].href);
                //     }
                // }
            }
        });
}

// Handller to place order
const placeOrder = async(req,res)=>{
    try{        

        // Extract payment method to request body
        const{ paymentMethod } = req.body

        // Extract user id from request object 
        const userId = req.user.userId

        // Extract address id from database with user id
        const addressId = await addressSchema.findOne({userId})

        // Exract users cart id from database with user id
        const usersCart = await cartSchema.findOne({userId})
        
        // Check if address id not found
        if(!addressId){ 
            return res.status(400).json({ message: 'address is not provided'})
        }

        // Check if users cart not found
        if(!usersCart){
            return res.status(400).json({message: 'users cart is empty'})
        }
        
        // Assign total amount from users cart
        const totalAmount = usersCart.totalAmount     

        // Create order details
        const orderDetails = orderSchema({
            cartId: usersCart,
            userId,
            addressId,
            totalAmount 
        })

        // Check if payment method is cod          
        if(paymentMethod == 'cod'){

            // Decreases the number of stock of the products from its collection
            for(let i=0; i < usersCart.products.length; i++ ){
                const product = await productSchema.findOne({'_id': usersCart.products[i].productId})
                product.stock -= usersCart.products[i].quantity
                await product.save()
            }

            // Save the created order details
            await orderDetails.save()

            // Return a success response
            return res.status(200).json({message:'order placed successfully '})
        }

    }
    catch(error){

        // Handle any errors
        console.error(error,'error in place order');
        res.status(500).json({error :'error in place order'})
        
    } 
}

// Handller to get order
const getOrder = async(req, res)=>{
    try{
        
        // Extract user id from request object 
        const userId = req.user.userId

        // Find by user id
        const orderDetails = await cartSchema.findOne({userId}).populate({ path: 'products.productId'})
         
        //Return a success response
        res.json({message:'get all orders successfully',
            orderDetails
        })
    }
    catch(error){

        // Handle any response
        console.error(error,'error in get order');
        res.status(500).json({error:'error in get order'})
        
    }

}

// Handller to delete order
const deleteOrder = async(req,res)=>{
    try{
        // Extract user id from request object 
        const userId = req.user.userId
        
        // Find by users id and delete
        await orderSchema.findByIdAndDelete(userId)
    }
    catch(error){

        // Handle any errors
        console.error('error in delete order',error);
        res.status(500).json({error: 'error in delete order'})
    }
}
 

module.exports = { placeOrder, getOrder, deleteOrder, createPayment}