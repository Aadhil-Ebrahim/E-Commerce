const express = require('express')
const Router = express.Router()
const {addWishlist,getWishList,removeWishlist} = require('../controller/userside/wishlist')
const verifyToken  = require('../middlewares/verifyToken')

Router.post('/addtowishlist/:productId', verifyToken, addWishlist)
Router.get('/getwishlist', verifyToken, getWishList)
Router.delete('/removewishlist/:productId', verifyToken, removeWishlist)


module.exports = Router 