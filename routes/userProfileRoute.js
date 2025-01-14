const {updateProfile, changedPassword, addAddress, getProfile, logout} = require('../controller/userside/usersProfile')
const verifyToken =  require('../middlewares/verifyToken')
const express = require('express')
const Router = express.Router()

Router.put('/updateprofile',verifyToken, updateProfile)
Router.put('/profile/changepassword', verifyToken, changedPassword)
Router.put('/profile/address', verifyToken, addAddress)
Router.post('/logout', verifyToken, logout)
Router.get('/profile', verifyToken, getProfile)

module.exports = Router