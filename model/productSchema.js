const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
    },
    stock:{
        type:Number,
        default:0
    },
    image:{ 
        type:String
    }
}) 
const product = mongoose.model('products',productSchema)
module.exports = product