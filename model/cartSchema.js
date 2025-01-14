const mongoose = require('mongoose')

const schema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'userDetails'
    },
    products:[{
        productId:{
             type: mongoose.Schema.ObjectId,
             ref: 'products'
        },
        quantity:{
            type: Number,
            default: 1
        },
        grossAmount:{
            type: Number
        }
       
    }],
    discountAmount:{
        type: Number
    },
    totalAmount:{
        type: Number
    },

}) 

module.exports = mongoose.model('cart', schema)