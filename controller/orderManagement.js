const orderSchema = require('../model/orderSchema')

// Handller to get all orderd
const getAllOrders = async(req, res)=>{
    try{
        // Find all order 
        const orderds = await orderSchema.find().populate({path: 'userId cartId addressId'})

        // Return succes response
        res.status(200).json({message: 'get all orders successfully',
            orderds
        })
    }
    catch(error){
        console.error('error in get all orders',error);
        res.json('error in get all orders')
    } 
}

//Handller to get users order by its id
const getUserOrderById = async(req, res)=>{
    try{
        // Extract order id from request params
        const orderId = req.params.orderId
                                                
        // Find order details by its id
        const orderDetails = await orderSchema.findById(orderId).populate({path: 'userId addressId cartId'})

        // Check if order details not found
        if(!orderDetails){
            return res.status(400).json({error: 'order not found in this id'})
        }
        
        // Return a success response
        res.status(200).json({orderDetails})
    }
    catch(error){

        // Handle any errors
        console.error('error in get order by id',error);
        res.json('error in get by id')
    }
 
}

//Handller to update order status 
const updateOrderStatus = async(req,res)=>{
    try{

        //Extract users id through request params
        const _id = req.params.orderId

        // Extract order status through request body
        const orderStatus = req.body
        
        // Find order by its id
        const order = await orderSchema.findById(_id)

        // Check if order does not exist
        if(!order){
            return res.json({ message: 'order id not found'})
        }

        // Find by id and update its status
        await orderSchema.findByIdAndUpdate( _id, orderStatus)

        // Return a success response
        return res.status(200).json({message: 'users order status updated'})
    
    }
    catch(error){

        // Handle any errors
        console.error('error in update order status');
        res.status(500).json({error: 'error in update order status'})
    }   
}

// Handller to delete order
const deleteOrder = async(req,res)=>{

    // Extract order id from request params
    const _id = req.params.orderId

    // Find from data base by its id
    const order = await orderSchema.findById(_id)

    // Check if order not found 
    if(!order){
        return res.status(404).json({message: 'order id not found'})
    }

    // Find by its id and delete frim the collelction
    await orderSchema.findByIdAndDelete(_id)
}

module.exports = { getAllOrders, getUserOrderById, updateOrderStatus, deleteOrder}