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

const placeOrder = async(req,res)=>{
    try{        

        const{ paymentMethod } = req.body
        const userId = req.user.userId
        const addressId = await addressSchema.findOne({userId})
        const usersCart = await cartSchema.findOne({userId})
        
        if(!addressId){ 
            return res.status(400).json({ message: 'address is not provided'})
        }

        if(!usersCart){
            return res.status(400).json({message: 'users cart is empty'})
        }
        
        const totalAmount = usersCart.totalAmount     

        const orderDetails = orderSchema({
            cartId: usersCart,
            userId,
            addressId,
            totalAmount 
        })

         
        if(paymentMethod == 'cod'){

            for(let i=0; i < usersCart.products.length; i++ ){
                const product = await productSchema.findOne({'_id': usersCart.products[i].productId})
                product.stock -= usersCart.products[i].quantity
                await product.save()
            }

            await orderDetails.save()
            return res.json({message:'order placed successfully '})
        }

    }
    catch(error){

        console.error(error,'error in place order');
        res.status(500).json({error :'error in place order'})
        
    } 
}

const getOrder = async(req, res)=>{
    try{
        const userId = req.user.userId
        const orderDetails = await cartSchema.findOne({userId}).populate({ path: 'products.productId'})
         
        res.json({message:'get all orders successfully',
            orderDetails
        })
    }
    catch(error){
        console.error(error,'error in get order');
        res.status(500).json({error:'error in get order'})
        
    }

}

const deleteOrder = async(req,res)=>{
    try{
        const userId = req.user.userId
        await orderSchema.findByIdAndDelete(userId)
    }
    catch(error){
        console.error('error in delete order',error);
        res.status(500).json({error: 'error in delete order'})
    }
}
 

module.exports = { placeOrder, getOrder, deleteOrder,createPayment}