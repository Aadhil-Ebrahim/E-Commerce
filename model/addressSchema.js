const mongoose = require('mongoose')
const address = mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'userDetails'
    },
    address:{
        type: String
    },
    city:{
        type: String
    },
    state:{
        type: String
    },
    pincode:{
        type: Number
    },
    phoneNumber:{
        type: Number
    }
    
})

module.exports = mongoose.model('address', address)