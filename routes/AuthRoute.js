const {register,login} = require('../controller/AuthController')

const express = require ('express')
const Router = express.Router()

Router.post('/auth/register',register)
Router.post('/auth/login',login)


module.exports = Router








 