const mongoose = require('mongoose')
const { type } = require('os')

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    resetToken:{
        type:String
    },
    resetTokenExpires:{
        type:String
    },
    isBlock:{
        type: Boolean,
        default: false
    },
    profilePicture:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    tokenVersion:{
        type: Number,
        default: 0
    }
})


const schema = mongoose.model('userDetails',userSchema)

module.exports = schema
