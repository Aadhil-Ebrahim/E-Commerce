const mongoose = require('mongoose')

const schema = mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'userDetails'
    },
    products:{
        type: mongoose.Types.ObjectId,
        ref: 'products'
    }
})

module.exports = mongoose.model('cart',schema)