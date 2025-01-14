const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    cartId:{
        type: mongoose.Types.ObjectId,
        ref: 'cart'
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'userDetails'
    },
    addressId:{
        type: mongoose.Types.ObjectId,
        ref: 'address'
    },
    orderStatus:{
        type: String,
        enum:['processing','shipped','delivered','cancelled'],
        default: 'processing'
    },
    paymentMethod:{
        type: String,
        enum:['cod','payonline']

    },
    paymentStatus:{
        type: String,
        enum:['pending','processing','complete'] 
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    totalAmount:{
        type: Number
    }
})

module.exports = mongoose.model('order', orderSchema)