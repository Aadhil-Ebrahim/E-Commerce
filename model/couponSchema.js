const mongoose = require('mongoose')
const schema = mongoose.Schema({
    code:{
        type: String
        
    },
    discountPercentage:{
        type: Number

    }, 
    productId:{
        type: mongoose.Types.ObjectId,
        ref: 'products'
    },
    usageLimit:{
        type: Number
    },
    isActive:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model( 'coupon', schema)