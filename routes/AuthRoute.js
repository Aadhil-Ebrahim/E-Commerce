const {register,login,forgetPassword,resetpassword} = require('../controller/AuthController')

const express = require ('express')
const Router = express.Router()

Router.post('/auth/register',register)
Router.post('/auth/login',login)
Router.post('/auth/forget-password',forgetPassword)
// Router.post('/auth/verify-otp',verifyotp)
Router.post('/auth/resetpassword/:token',resetpassword)


module.exports = Router








 